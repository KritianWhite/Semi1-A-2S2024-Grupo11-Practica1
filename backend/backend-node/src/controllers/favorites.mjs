import { consult } from "../database/database.mjs";

const addsong = async (req, res) => {
  try {
    const { iduser, idsong } = req.body;

    if (iduser === undefined || idsong === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let check = await consult(`select exists (select *from favorito where id_usuario = '${iduser}' and id_cancion = '${idsong}') as userExists;`);


    if (check[0].status == 200 && check[0].result[0].userExists == 0) {
      const result = await consult(`insert into favorito(id_usuario, id_cancion) values (${iduser}, '${idsong}');`);
      if (result[0].status == 200) {
        return res
          .status(200)
          .json({ status: 200, message: "Se marcó como favorito" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res.status(500).json({ status: 500, message: "Canción ya ha sido marcada como favorita" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const removesong = async (req, res) => {
  try {
    const { iduser, idsong } = req.body;
    if (iduser === undefined || idsong === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `delete from favorito where id_usuario = '${iduser}' and id_cancion = '${idsong}';`;
    const result = await consult(xsql);

    if (result[0].status == 200 && result[0].result.affectedRows > 0) {
      return res.status(200).json({status:200, message: "Canción eliminada de favoritos" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "canción no se pudo elminar de favoritos" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getsongs = async (req, res) => {
  try {
    const { iduser} = req.body;
    if (iduser === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    const result = await consult(`SELECT c.id as id, c.nombre, c.url_caratula as url_caratula, c.duracion, c.artista, c.url_mp3, 1 as es_favorito 
      FROM favorito INNER JOIN cancion as c ON favorito.id_cancion = c.id WHERE favorito.id_usuario = ${iduser};`);

    if (result[0].status == 200) {
      return res.status(200).json(result[0].result);
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Error al obtener datos" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export const favorites = {
  addsong,
  removesong,
  getsongs
};
