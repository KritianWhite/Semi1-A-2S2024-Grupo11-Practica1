import { consult } from "../database/database.mjs";

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
      const xsql = `insert into cancion (nombre, url_caratula, duracion, artista, url_mp3) 
            values ('${nombre}', '${imagen}', '${duracion}', '${artista}', '${mp3}');`;

      const result = await consult(xsql);

      if (result[0].status == 200) {
        return res.status(200).json({ message: "Canción creada" });
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

const modify = async (req, res) => {
  try {
    const { idcancion, nombre, url_imagen, duracion, artista } = req.body;
    if (
      idcancion === undefined ||
      nombre === undefined ||
      url_imagen === undefined ||
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
      
      result = await consult(`update cancion set nombre = '${nombre}', url_caratula = '${url_imagen}', duracion= '${duracion}', artista = '${artista}' where id = ${idcancion};`);
      if (result[0].status == 200) {
        return res.status(200).json({ message: "Canción actualizado" });
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
      return res.status(200).json({ message: "Canción eliminada" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error, cancion no se puedo eliminar" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export const song = {
  create,
  list,
  modify,
  remove,
};
