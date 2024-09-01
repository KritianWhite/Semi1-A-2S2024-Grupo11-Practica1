import { consult } from "../database/database.mjs";
import { uploadImageS3, deleteObjectS3 } from "../s3.mjs";
import config from "../config.mjs";

const create = async (req, res) => {
  try {
    const { iduser, nombre, descripcion, portada } = req.body;

    if (
      iduser === undefined ||
      nombre === undefined ||
      descripcion === undefined ||
      portada === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    //guardar la portada de la playlist en S3
    const base64Data = portada.replace(/^data:image\/\w+;base64,/, "");
    const buff = Buffer.from(base64Data, "base64");
    const fechaHoraActual = new Date();
    const ano = fechaHoraActual.getFullYear().toString();
    const mes = (fechaHoraActual.getMonth() + 1).toString().padStart(2, '0'); // Se agrega +1 porque los meses se indexan desde 0
    const dia = fechaHoraActual.getDate().toString().padStart(2, '0');
    const hora = fechaHoraActual.getHours().toString().padStart(2, '0');
    const minutos = fechaHoraActual.getMinutes().toString().padStart(2, '0');
    const segundos = fechaHoraActual.getSeconds().toString().padStart(2, '0');

    const fechaHoraNumerica = `${ano}${mes}${dia}${hora}${minutos}${segundos}`;


    const path = `Playlist/${nombreSinEspacios + fechaHoraNumerica}.jpg`;

    const response = await uploadImageS3(buff, path);

    if (response == null){
      return res.status(500).json({ status: 500, message: "Error al subir la imagen" });
    }

    const url_portada = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

    const result =
      await consult(`insert into playlist (nombre, descripcion, url_portada, id_user, eliminada) 
            values ('${nombre}', '${descripcion}', '${url_portada}', '${iduser}', 0);`);

    if (result[0].status == 200) {
      //obtenemos el id de la playlist creada
      const idplaylist = result[0].result.insertId;

      return res.status(200).json({status: 200, message: "Playlist creada", id: idplaylist});
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const getall = async (req, res) => {
  try {
    const { iduser } = req.body;

    if (iduser === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `select id, nombre, descripcion, url_portada
     from playlist where id_user = '${iduser}' and eliminada = 0;`;
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

const modify = async (req, res) => {
  try {
    const { iduser, idplaylist, nombre, descripcion } = req.body;
    if (
      iduser === undefined ||
      idplaylist === undefined ||
      nombre === undefined ||
      descripcion === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }
    let result = await consult(
      `select *from playlist where id = '${idplaylist}' and id_user = '${iduser}';`
    );

    if (result[0].status == 200 && result[0].result.length > 0) {

      result = await consult(`update playlist set nombre = '${nombre}',
         descripcion = '${descripcion}' where id = '${idplaylist}' and id_user = '${iduser}';`);
      if (result[0].status == 200) {
        return res.status(200).json({ status: 200, message: "Playlist modificada" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "error playlist no existe" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const updatefoto = async (req, res) => {
    try{
      const {idplaylist, imagen} = req.body;
      if(idplaylist === undefined || imagen === undefined){
        return res.status(404).json({ status: 404, message: "Solicitud incorrecta. Por favor, rellene todos los campos." });
      }

      //verificar que la playlist exista
      const check = await consult(`select * from playlist where id = '${idplaylist}';`);
      if(check[0].status == 200 && check[0].result.length == 0){
        return res.status(500).json({ status: 500, message: "Playlist no existe" });
      }

      //guardar la portada de la playlist en S3
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
      const nombreSinEspacios = check[0].result[0].nombre.replace(/\s/g, '').replace(/\./g, '');

      const path = `Playlist/${nombreSinEspacios + fechaHoraNumerica}.jpg`;

      let response = await uploadImageS3(buff, path);

      if (response == null){
        return res.status(500).json({ status: 500, message: "Error al subir la imagen" });
      }

      const url_portada = `https://${config.bucket}.s3.${config.region}.amazonaws.com/${path}`;

      const result = await consult(`update playlist set url_portada = '${url_portada}' where id = '${idplaylist}';`);

      if(result[0].status == 200){

        response = await deleteObjectS3(check[0].result[0].url_portada);
        if(response == null){
          return res.status(500).json({ status: 500, message: "Error al eliminar la imagen antigua" });
        }

        return res.status(200).json({ status: 200, message: "Imagen actualizada", url: url_portada });
      }else{
        return res.status(500).json({ status: 500, message: result[0].message });
      }
    }catch(error){
      console.log(error);
      return res.status(500).json({ status: 500, message: error.message });
    }
}


const deleteplaylist = async (req, res) => {
  try {
    const { idplaylist } = req.body;
    if (idplaylist === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

  
    let result = await consult(`select url_portada from playlist where id = '${idplaylist}';`);
    if(result[0].status == 200 && result[0].result.length > 0){

      //esto no es necesario, ya que solo estamos ocultando la playlist por lo cual la imagen puede quedarse
      //por para que no ocupe espacio en el s3 vamos a eliminar, aunque no es necesario
      let response = await deleteObjectS3(result[0].result[0].url_portada);
      if(response == null){
        return res.status(500).json({ status: 500, message: "Error al eliminar la imagen" });
      }
      //----------------------------------------------

      result = await consult(`update playlist set eliminada = 1 where id = '${idplaylist}';`);

      if (result[0].status == 200 && result[0].result.affectedRows > 0) {
        return res.status(200).json({status:200, message: "Playlist eliminada" });
      }
    }

    return res
    .status(500)
    .json({ status: 500, message: "error playlist no se eliminó" });
    
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const addsong = async (req, res) => {
  try {
    const { iduser, idplaylist, idsong } = req.body;

    if (
      iduser === undefined ||
      idplaylist === undefined ||
      idsong === undefined
    ) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    //verifico que exista la playlist con el id_usuario y el id_playlist
    const checkUsPly = await consult(`select exists (
        select * from playlist as pl
        where pl.id = ${idplaylist} and pl.id_user = ${iduser}
      ) as usplyExists;`);

    if (
      checkUsPly[0].status == 200 &&
      checkUsPly[0].result[0].usplyExists == 0
    ) {
      return res
        .status(500)
        .json({ status: 500, message: "Playlist/usuario no existe" });
    } else {
      //si existe la playlist, verifico que la cancion exista para esa playlist y usuario
      const check = await consult(`
        select exists ( 
          select * from cancionplaylist as caply
          INNER JOIN playlist as pl on pl.id = caply.id_playlist
          INNER JOIN cancion as ca on ca.id = caply.id_cancion
          where pl.id = ${idplaylist} and pl.id_user = ${iduser} and ca.id = ${idsong}
        ) as songExists;
      `);
      if (check[0].status == 200 && check[0].result[0].songExists == 0) { //si no existe la cancion en la playlist, la agrego
        const result =
          await consult(`insert into cancionplaylist (id_cancion, id_playlist) 
              values ('${idsong}', '${idplaylist}');`);

        if (result[0].status == 200) {
          return res
            .status(200)
            .json({status:200, message: "Canción añadida a playlist" });
        } else {
          return res
            .status(500)
            .json({ status: 500, message: result[0].message });
        }
      } else {  //si ya existe la cancion en la playlist, mando mensaje de error
        return res.status(500).json({
          status: 500,
          message: "Canción ya ha sido añadida a playlist",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const removesong = async (req, res) => {
  try {
    const { idplaylist, idsong } = req.body;
    if (idplaylist === undefined || idsong === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    const result = await consult(
      `delete from cancionplaylist where id_playlist = '${idplaylist}' and id_cancion = '${idsong}';`
    );

    if (result[0].status == 200 && result[0].result.affectedRows > 0) {
      return res.status(200).json({status:200, message: "Canción eliminada de playlist" });
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "canción no se pudo elminar de playlist" });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};


const getsongs = async (req, res) => {
  try {
    const { idplaylist } = req.body;

    if (idplaylist === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let xsql = `select ca.id, ca.nombre, ca.url_caratula, ca.duracion, ca.artista, ca.url_mp3
     from cancionplaylist as caply
     INNER JOIN cancion as ca on ca.id = caply.id_cancion
     where caply.id_playlist = '${idplaylist}';`;
    let result = await consult(xsql);
    if (result[0].status == 200 && result[0].result.length > 0) {
      return res.status(200).json(result[0].result);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

export const playlist = {
  create,
  getall,
  modify,
  deleteplaylist,
  addsong,
  removesong,
  getsongs,
  updatefoto,
};
