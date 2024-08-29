DROP DATABASE IF EXISTS soundstream;
CREATE DATABASE  IF NOT EXISTS `soundstream` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `soundstream`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: soundstream
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cancion`
--

DROP TABLE IF EXISTS `cancion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(65) NOT NULL,
  `duracion` time NOT NULL,
  `url_caratula` varchar(200) NOT NULL,
  `url_mp3` varchar(200) NOT NULL,
  `artista` varchar(65) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cancionplaylist`
--

DROP TABLE IF EXISTS `cancionplaylist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancionplaylist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cancion` int NOT NULL,
  `id_playlist` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `PlaylistSong_FK_Playlist` (`id_playlist`),
  KEY `PlaylistSong_FK_Song` (`id_cancion`),
  CONSTRAINT `PlaylistSong_FK_Playlist` FOREIGN KEY (`id_playlist`) REFERENCES `playlist` (`id`),
  CONSTRAINT `PlaylistSong_FK_Song` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favorito`
--

DROP TABLE IF EXISTS `favorito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorito` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_cancion` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Favorito_FK_Usuario` (`id_usuario`),
  KEY `Favorito_FK_Cancion` (`id_cancion`),
  CONSTRAINT `Favorito_FK_Cancion` FOREIGN KEY (`id_cancion`) REFERENCES `cancion` (`id`),
  CONSTRAINT `Favorito_FK_Usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `playlist`
--

DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(65) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `url_portada` varchar(200) NOT NULL,
  `id_user` int NOT NULL,
  `eliminada` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Playlist_FK_Usuario` (`id_user`),
  CONSTRAINT `Playlist_FK_Usuario` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipousuario`
--

DROP TABLE IF EXISTS `tipousuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipousuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(65) NOT NULL,
  `apellido` varchar(65) NOT NULL,
  `url_imagen` varchar(200) NOT NULL,
  `password` varchar(80) NOT NULL,
  `email` varchar(65) NOT NULL,
  `nacimiento` date NOT NULL,
  `id_tipo_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Usuario_FK_TipoUsuario` (`id_tipo_usuario`),
  CONSTRAINT `Usuario_FK_TipoUsuario` FOREIGN KEY (`id_tipo_usuario`) REFERENCES `tipousuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-26 14:26:45

INSERT INTO tipousuario (nombre) VALUES ('Administrador');
INSERT INTO tipousuario (nombre) VALUES ('Usuario');
INSERT INTO usuario (nombre, apellido, url_imagen, password, email, nacimiento,id_tipo_usuario) VALUES 
('admin', 'admin', 'https://avatars.githubusercontent.com/u/88564832?v=4','$2a$12$99EGkW1/PbVUFRr8S0F/OOcb2Euk.tCru1RHngvoQqoDTd8oknKtm', 'admin@gmail.com', '2000-01-01',1);
