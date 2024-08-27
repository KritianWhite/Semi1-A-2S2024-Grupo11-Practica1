import * as bcrypt from "bcrypt";
import { consult } from "../database/database.mjs";
import config from "../config.mjs";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
      res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos",
      });
    }
    let result = await consult(
      `SELECT * FROM usuario where email = '${email}'`
    );
    if (result[0].status == 200 && result[0].result.length > 0) {
      let checkPass = bcrypt.compareSync(
        password,
        result[0].result[0].password
      );

      if (checkPass) {
        const dataUser = {
          iduser: result[0].result[0].id,
          role: result[0].result[0].id_tipo_usuario,
        };
        return res.status(200).json({ status: 200, iduser: dataUser.iduser, role: dataUser.role });
      } else {
        return res
          .status(409)
          .json({ status: 409, message: "Password Incorrecto" });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "usuario no existe" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const registro = async (req, res) => {
  try {
    const { nombre, apellido, imagen, email, password, nacimiento } = req.body;

    if (
      nombre === undefined ||
      apellido === undefined ||
      imagen === undefined ||
      email === undefined ||
      password === undefined ||
      nacimiento === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    const check = await consult(
      `select exists (select *from usuario where email= '${email}') as userExists;`
    );

    if (check[0].status == 200 && check[0].result[0].userExists == 0) {
      //si no existe el usuario
      //subir imagen a S3
      const base64Data = imagen.replace(/^data:image\/\w+;base64,/, "");
      const buff = Buffer.from(base64Data, "base64");
      const fechaHoraActual = new Date();
      const ano = fechaHoraActual.getFullYear().toString();
      const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Se agrega +1 porque los meses se indexan desde 0
      const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
      const hora = fechaHoraActual.getHours().toString().padStart(2, '0');
      const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
      const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

      const fechaHoraNumerica = `${ano}${mes}${dia}${hora}${minutos}${segundos}`;

      const path = `Fotos/${email+fechaHoraNumerica}.jpg`;

      const response = await uploadImageS3(buff, path);

      if (response == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir imagen en S3" });
      }

      const url_imagen = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      //almacenamos la url de la imagen en la base de datos
      const xsql = `insert into usuario (nombre, apellido, url_imagen, email, password, nacimiento, id_tipo_usuario) 
      values ('${nombre}', '${apellido}', '${url_imagen}', '${email}', '${hash}', '${nacimiento}', 2);`;

      const result = await consult(xsql);

      if (result[0].status == 200) {
        return res
          .status(200)
          .json({ status: 200, message: "Usuario registrado" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Email ya ha sido registrado" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getuser = async (req, res) => {
  try {
    const { id } = req.body;
    if (id === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    const xsql = `select *from usuario where id = ${id};`;

    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.length > 0) {
      let dateObj = new Date(result[0].result[0].nacimiento);
      const dataUser = {
        nombre: result[0].result[0].nombre,
        apellido: result[0].result[0].apellido,
        url_imagen: result[0].result[0].url_imagen,
        email: result[0].result[0].email,
        nacimiento: dateObj.toISOString().split("T")[0],
        admin: result[0].result[0].id_tipo_usuario,
      };
      return res.status(200).json(dataUser);
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error usuario no existe" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id, nombre, apellido, nacimiento, password } = req.body;
    if (
      id === undefined ||
      nombre === undefined ||
      apellido === undefined ||
      password === undefined ||
      nacimiento === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    //verificar password
    let resultCheck = await consult(
      `SELECT * FROM usuario where id = '${id}'`
    );
    if (resultCheck[0].status == 200 && resultCheck[0].result.length > 0) { //si existe el usuario
      let checkPass = bcrypt.compareSync(
        password,
        resultCheck[0].result[0].password
      ); //comparamos el password

      if (checkPass) {
        //actualizar usuario
        let xsql = `update usuario set nombre = '${nombre}', apellido = '${apellido}', nacimiento = '${nacimiento}' where id = ${id};`;
        const result = await consult(xsql);
        if (result[0].status == 200) {
          return res.status(200).json({ status: 200, message: "Usuario actualizado" });
        } else {
          return res
            .status(500)
            .json({ status: 500, message: result[0].message });
        }
      } else {
        return res
          .status(409)
          .json({ status: 409, message: "Password Incorrecto" });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "usuario no existe" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const updatephoto = async (req, res) => {
  try {
    const { id, email, imagen, password } = req.body;
    if (id === undefined || email === undefined || imagen === undefined || password === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `select * from usuario where id = '${id}' and email = '${email}';`;
    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.length > 0) {
      //verificamos el password
      let checkPass = bcrypt.compareSync(password, result[0].result[0].password);

      if (!checkPass) {
        return res
          .status(409)
          .json({ status: 409, message: "Password Incorrecto" });
      }

      const base64Data = imagen.replace(/^data:image\/\w+;base64,/, "");
      const buff = Buffer.from(base64Data, "base64");
      const fechaHoraActual = new Date();
      const ano = fechaHoraActual.getFullYear().toString();
      const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Se agrega +1 porque los meses se indexan desde 0
      const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
      const hora = fechaHoraActual.getHours().toString().padStart(2, '0');
      const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
      const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

      const fechaHoraNumerica = `${ano}${mes}${dia}${hora}${minutos}${segundos}`;

      const path = `Fotos/${email+fechaHoraNumerica}.jpg`;

      const response = await uploadImageS3(buff, path);

      if (response == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir imagen en S3" });
      }

      let url_imagen = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

      xsql = `update usuario set url_imagen = '${url_imagen}' where id = ${id};`;
      const result2 = await consult(xsql);
      if (result2[0].status == 200) {
        return res.status(200).json({status:200, message: "Foto de perfil actualizada" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result2[0].message });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error usuario no existe" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

//recibe un buffer y lo sube a S3
const uploadImageS3 = async (buff, path) => {
  const client = new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: path,
    Body: buff,
    ContentType: "image/jpeg",
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const user = {
  login,
  registro,
  getuser,
  update,
  updatephoto,
};
