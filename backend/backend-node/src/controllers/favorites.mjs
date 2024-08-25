import { consult } from "../database/database.mjs";

const addsong = async (req, res) => {
  try {
    const { idsong, email } = req.body;

    if (idsong === undefined || email === undefined) {
      return res.status(404).json({
        status: 404,
        message: "Solicitud incorrecta. Por favor, rellene todos los campos.",
      });
    }

    let conStr = `select exists (select *from favoritos where idsong = '${idsong}' and email = '${email}') as userExists;`;

    let result = await consult(conStr);

    if (result[0].status == 200 && result[0].result[0].userExists == 0) {
      let xsql = `insert into favoritos(idsong, email) values (${idsong}, '${email}');`;
      result = await consult(xsql);
      if (result[0].status == 200) {
        return res
          .status(200)
          .json({ status: 200, message: "Se marco como favorito" });
      } else {
        return res
          .status(500)
          .json({ status: 500, message: result[0].message });
      }
    } else {
      return res.status(500).json({ status: 500, message: result[0].message });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

const removesong = async (req, res) => {};

const getsongs = async (req, res) => {};

export const favorites = {
  addsong,
  removesong,
  getsongs
};
