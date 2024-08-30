import { consult } from "../database/database.mjs";
import { uploadImageS3, uploadMP3S3 } from "../s3.mjs";
import config from "../config.mjs";

const create = async (req, res) => {
  try {
    const { nombre, imagen, duracion, artista, mp3 } = req.body;

    if (
      nombre === undefined ||
      imagen === undefined ||
      duracion === undefined ||
      artista === undefined ||
      mp3 === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    const check = await consult(`select exists (select * from cancion where nombre = '${nombre}' and duracion = '${duracion}'
    and artista = '${artista}') as songExists;`);  

    if (check[0].status == 200 && check[0].result[0].songExists == 0) {

      //guardar la caratula de la cancion en S3
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

      //eliminar los espacios en blanco y los puntos
      const nombreSinEspacios = nombre.replace(/\s/g, '').replace(/\./g, '');

      const path = `Fotos/${nombreSinEspacios + fechaHoraNumerica}.jpg`;

      const response = await uploadImageS3(buff, path);

      if (response == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir imagen en S3" });
      }

      //subir el mp3 a S3
      const base64DataMp3 = mp3.replace(/^data:audio\/\w+;base64,/, "");
      const buffMp3 = Buffer.from(base64DataMp3, "base64");
      const pathMp3 = `Canciones/${nombreSinEspacios + fechaHoraNumerica}.mp3`;

      const responseMp3 = await uploadMP3S3(buffMp3, pathMp3);

      if (responseMp3 == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir mp3 en S3" });
      }

      const url_caratula = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;
      const url_mp3 = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${pathMp3}`;

      const xsql = `insert into cancion (nombre, url_caratula, duracion, artista, url_mp3) 
            values ('${nombre}', '${url_caratula}', '${duracion}', '${artista}', '${url_mp3}');`;

      const result = await consult(xsql);

      if (result[0].status == 200) {
        //obtener el id de la cancion
        const id_cancion = await consult(`select id from cancion where nombre = '${nombre}' and duracion = '${duracion}' and artista = '${artista}';`);
        if (id_cancion[0].status == 200) {
          return res.status(200).json({status: 200, message: "Canción creada", id_cancion: id_cancion[0].result[0].id });
        }
        return res.status(500).json({ status: 500, message: "Error al obtener el id de la canción creada" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Canción ya existe" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const list = async (req, res) => {
  try {
    let xsql = `select * from cancion;`;
    let result = await consult(xsql);
    if (result[0].status == 200) {
      //return res.status(200).json({ canciones: result[0].result });
      return res.status(200).json(result[0].result);
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getall = async (req, res) => {
  try {
    const { idusuario } = req.body;
    if (idusuario === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta.",
      });
    }

    let xsql = `select c.*, IF(f.id_usuario IS NOT NULL, 1, 0) as es_favorito from cancion c left join favorito f on c.id = f.id_cancion AND f.id_usuario = '${idusuario}';`;
    let result = await consult(xsql);
    if (result[0].status == 200) {
      //return res.status(200).json({ canciones: result[0].result });
      return res.status(200).json(result[0].result);
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const modify = async (req, res) => {
  try {
    const { idcancion, nombre, duracion, artista } = req.body;
    if (
      idcancion === undefined ||
      nombre === undefined ||
      duracion === undefined ||
      artista === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let result = await consult(`select *from cancion where id = '${idcancion}';`);

    if (result[0].status == 200 && result[0].result.length > 0) {
      
      result = await consult(`update cancion set nombre = '${nombre}', duracion= '${duracion}', artista = '${artista}' where id = ${idcancion};`);
      if (result[0].status == 200) {
        return res.status(200).json({status: 200, message: "Canción actualizada" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error cancion no existe" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const {idcancion, imagen} = req.body;
    if (idcancion === undefined || imagen === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let result = await consult(`select *from cancion where id = '${idcancion}';`);

    if (result[0].status == 200 && result[0].result.length > 0) {
      //guardar la caratula de la cancion en S3
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

      //eliminar los espacios en blanco y los puntos
      const nombreSinEspacios = result[0].result[0].nombre.replace(/\s/g, '').replace(/\./g, '');

      const path = `Fotos/${nombreSinEspacios + fechaHoraNumerica}.jpg`;

      const response = await uploadImageS3(buff, path);

      if (response == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir imagen en S3" });
      }

      const url_caratula = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

      result = await consult(`update cancion set url_caratula = '${url_caratula}' where id = ${idcancion};`);
      if (result[0].status == 200) {
        return res.status(200).json({status: 200, message: "Imagen de canción actualizada", url: url_caratula });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

const updateMp3 = async (req, res) => {
  try {
    const {idcancion, mp3} = req.body;
    if (idcancion === undefined || mp3 === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let result = await consult(`select *from cancion where id = '${idcancion}';`);

    if (result[0].status == 200 && result[0].result.length > 0) {
      //guardar el mp3 de la cancion en S3
      const base64Data = mp3.replace(/^data:image\/\w+;base64,/, "");
      const buff = Buffer.from(base64Data, "base64");
      const fechaHoraActual = new Date();
      const ano = fechaHoraActual.getFullYear().toString();
      const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Se agrega +1 porque los meses se indexan desde 0
      const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
      const hora = fechaHoraActual.getHours().toString().padStart(2, '0');
      const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
      const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

      const fechaHoraNumerica = `${ano}${mes}${dia}${hora}${minutos}${segundos}`;

      //eliminar los espacios en blanco y los puntos
      const nombreSinEspacios = result[0].result[0].nombre.replace(/\s/g, '').replace(/\./g, '');

      const path = `Canciones/${nombreSinEspacios + fechaHoraNumerica}.mp3`;

      const response = await uploadMP3S3(buff, path);

      if (response == null) {
        return res
          .status(500)
          .json({ status: 500, message: "Error al subir cancion en S3" });
      }

      const url_mp3 = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

      result = await consult(`update cancion set url_mp3 = '${url_mp3}' where id = ${idcancion};`);
      if (result[0].status == 200) {
        return res.status(200).json({status: 200, message: "MP3 de la canción actualizado", url: url_mp3 });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
}

const remove = async (req, res) => {
  try {
    const { idcancion } = req.body;
    if (idcancion === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    /*da error si se elimina la canción, ya que la canción esta añadida a la tabla favoritos o playlist
    y estan relacionadas por una llave foranea, entonces eliminó primero la canción de las tablas favoritos y playlist.
    El usuario no importa ya que no se eliminan usuarios en el proyecto.*/
  
    let result = await consult(`delete from favorito where id_cancion = '${idcancion}';`);
    result = await consult(`delete from cancionplaylist where id_cancion = '${idcancion}';`);

    result = await consult(`delete from cancion where id = '${idcancion}';`);

    if (result[0].status == 200 && result[0].result.affectedRows > 0) {
      return res.status(200).json({status:200, message: "Canción eliminada" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error, cancion no se pudo eliminar" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const lastest = async (req, res) => { // retorna las ultimas canciones añadidas para mostrar en la pagina principal
  //obtenemos el id del usuario
  const { idusuario } = req.body;
  if(idusuario === undefined) {
    return res.status(404).json({
      status: 404,
      message: "Ocurrió un error interno"
    });
  }
  try {
    let xsql = `select c.*, IF(f.id_usuario IS NOT NULL, 1, 0) as es_favorito from cancion c left join favorito f on c.id = f.id_cancion AND f.id_usuario = '${idusuario}' order by c.id desc limit 10;`;
    let result = await consult(xsql);
    if (result[0].status == 200) {
      return res.status(200).json(result[0].result);
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export const song = {
  create,
  list,
  modify,
  updateImage,
  updateMp3,
  remove,
  lastest,
  getall
};
