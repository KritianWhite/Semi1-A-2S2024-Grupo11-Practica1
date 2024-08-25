import * as bcrypt from "bcrypt";
import { consult } from "../database/database.mjs";

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
        };
        return res.status(200).json(dataUser);
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
    const { nombre, apellido, url_imagen, email, password, nacimiento } =
      req.body;

    if (
      nombre === undefined ||
      apellido === undefined ||
      url_imagen === undefined ||
      email === undefined ||
      password === undefined ||
      nacimiento === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const check = await consult(
      `select exists (select *from usuario where email= '${email}') as userExists;`
    );

    if (check[0].status == 200 && check[0].result[0].userExists == 0) {
      const xsql = `insert into usuario (nombre, apellido, url_imagen, email, password, nacimiento, id_tipo_usuario) 
      values ('${nombre}', '${apellido}', '${url_imagen}', '${email}', '${hash}', '${nacimiento}', 2);`;

      const result = await consult(xsql);

      if (result[0].status == 200) {
        return res.status(200).json({ message: "Usuario registrado" });
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
    const { id, nombre, apellido, url_imagen, email, password } = req.body;
    if (
      id === undefined ||
      nombre === undefined ||
      apellido === undefined ||
      url_imagen === undefined ||
      email === undefined ||
      password === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `select *from usuario where id = '${id}'`;
    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.length > 0) {
      let checkPass = bcrypt.compareSync(
        password,
        result[0].result[0].password
      );
      if (checkPass) {
        xsql = `update usuario set nombre = '${nombre}', apellido = '${apellido}', url_imagen = '${url_imagen}', email = '${email}' where id = ${id};`;

        const result = await consult(xsql);
        if (result[0].status == 200) {
          return res.status(200).json({ message: "Usuario actualizado" });
        } else {
          return res
            .status(500)
            .json({ status: 500, message: result[0].message });
        }
      } else {
        return res
          .status(500)
          .json({ status: 500, message: "Password Incorrecto" });
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

export const user = {
  login,
  registro,
  getuser,
  update,
};
