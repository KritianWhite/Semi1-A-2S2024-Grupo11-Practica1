import { Router } from "express";
import { favorites } from "../controllers/favorites.mjs";
import { playlist } from "../controllers/playlist.mjs";
import { song } from "../controllers/song.mjs";
import { user } from "../controllers/user.mjs";

const router = Router();

/*****Usuario****/
router.post("/user/login", user.login);
router.post("/user/register", user.registro);
router.post("/user/getuser", user.getuser);
router.post("/user/update", user.update);
router.post("/user/updatephoto", user.updatephoto);

/*****Canciones****/
router.post("/song/create", song.create);
router.get("/song/list", song.list);
router.post("/song/modify", song.modify);
router.post("/song/updateimage", song.updateImage);
router.post("/song/updatemp3", song.updateMp3);
router.post("/song/remove", song.remove);
router.post("/song/lastest", song.lastest);
router.post("/song/search", song.getall); //para obtener todas las canciones y saber si estan en favoritos

/*****Playlists****/
router.post("/playlist/create", playlist.create);
router.post("/playlist/getall", playlist.getall);
router.post("/playlist/modify", playlist.modify);
router.post("/playlist/updatefoto", playlist.updatefoto);
router.post("/playlist/delete", playlist.deleteplaylist);
router.post("/playlist/addsong", playlist.addsong);
router.post("/playlist/removesong", playlist.removesong);
router.post("/playlist/getsongs", playlist.getsongs);

/*****Favoritos****/
router.post("/favorites/addsong", favorites.addsong);
router.post("/favorites/removesong", favorites.removesong);
router.post("/favorites/getsongs", favorites.getsongs);

export default router; 