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

    let xsql = `insert into cancion (nombre, url_caratula, duracion, artista, url_mp3) 
            values ('${nombre}', '${imagen}', '${duracion}', '${artista}', '${mp3}');`;

    const result = await consult(xsql);

    if (result[0].status == 200) {
      return res.status(200).json({ message: "Canción creada" });
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
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
      return res.status(200).json({ canciones: result[0].result });
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

    let xsql = `select *from cancion where id = '${idcancion}';`;
    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.length > 0) {
      xsql = `update cancion set nombre = '${nombre}', url_caratula = '${url_imagen}', duracion= '${duracion}', artista = '${artista}' where id = ${idcancion};`;
      const result = await consult(xsql);
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
    if (
      idcancion === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `delete from cancion where id = '${idcancion}';`;
    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.affectedRows > 0) {
      return res.status(200).json({ message: "Canción eliminada" });
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

export const song = {
  create,
  list,
  modify,
  remove,
};
