import * as jwt from 'jsonwebtoken';
import config from "./../config";

export const authenticateToken = async (req, res, next) => {
  
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({status:401, message:"Token no funciona"});
  }

  jwt.verify(token, config.myToken, (err, result) => {
    if (err) {
      return res.status(403).json({ status: 403, message: "Token invalido" });
    }
    req.id = result.id;
    req.email = result.email;
    next();
  });
} 

export const authenticateUser = async (req, res, next) => {
  
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({status:401, message:"Token no funciona"});
  }

  jwt.verify(token, config.myToken, (err, result) => {
    if (err) {
      return res.status(403).json({ status: 403, message: "Token invalido" });
    }
    req.id = result.id;
    req.user = result.usuario;
    next();
  });
} 



export const authenticateImagen = async (req, res, next) => {
  
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({status:401, message:"Token no funciona"});
  }

  jwt.verify(token, config.myToken, (err, result) => {
    if (err) {
      jwt.verify(token, config.myToken, (err, result) => {
        if (err) {
          return res.status(403).json({ status: 403, message: "Token invalido" });
        }
        req.id = result.id;
        req.user = result.usuario;
        next();
      }); 
    }
    console.log("ya no llego aqui");
    req.id = result.id;
    req.email = result.email;
    next();
  });
} 