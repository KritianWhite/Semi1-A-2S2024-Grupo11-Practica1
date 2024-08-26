-- SCRIPT DATABASE INITIALIZATION  MYSQL
-- CASE: Entidades - PascalCase - Singular
--       Columnas -  snake_case
--       Constraints -  snake_case

-- eliminar la base de datos si existe
DROP DATABASE IF EXISTS SOUNDSTREAM;

-- Create the database
CREATE DATABASE SOUNDSTREAM;
-- Use the database
USE SOUNDSTREAM;

-- Create the tables


-- Table: Type Users
CREATE TABLE TipoUsuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL
);

-- Table: Users
CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(65) NOT NULL,
    apellido VARCHAR(65) NOT NULL,
    url_imagen VARCHAR(200) NOT NULL, -- ruta de la foto en el bucket de S3
    password VARCHAR(80) NOT NULL,
    email VARCHAR(65) NOT NULL,
    nacimiento DATE NOT NULL,
    id_tipo_usuario INT NOT NULL,
    -- constraints
    CONSTRAINT Usuario_FK_TipoUsuario FOREIGN KEY (id_tipo_usuario) REFERENCES TipoUsuario(id)
);

-- create user admin

INSERT INTO TipoUsuario (nombre) VALUES ('Administrador');
INSERT INTO TipoUsuario (nombre) VALUES ('Usuario');
INSERT into usuario(nombre, apellido, url_imagen, password, email, nacimiento, id_tipo_usuario) values ("admin", "admin", "https://avatars.githubusercontent.com/u/88564832?v=4", "$2b$10$ONxary/UUgA1pEFVvwjVye16gQpwK2xQpGNK5SFn4.EEEe7sF9Br6", "admin@gmail.com", "1998-08-01", 1);

-- Table: Songs

CREATE TABLE Cancion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(65) NOT NULL,
    duracion TIME NOT NULL,
    url_caratula VARCHAR(200) NOT NULL, -- ruta de la imagen en el bucket de S3
    url_mp3 VARCHAR(200) NOT NULL, -- ruta del archivo en el bucket de S3
    artista VARCHAR (65) NOT NULL
);


-- Table: Favoritos
CREATE TABLE Favorito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_cancion INT NOT NULL,
    -- constraints
    CONSTRAINT Favorito_FK_Usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    CONSTRAINT Favorito_FK_Cancion FOREIGN KEY (id_cancion) REFERENCES Cancion(id)
);

-- Table: Playlist
CREATE TABLE Playlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(65) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    url_portada VARCHAR(200) NOT NULL, -- ruta de la imagen en el bucket de S3
    id_user INT NOT NULL,
    eliminada BOOLEAN NOT NULL,
    -- constraints
    CONSTRAINT Playlist_FK_Usuario FOREIGN KEY (id_user) REFERENCES Usuario(id)
);

-- Table: CancionPlaylist
CREATE TABLE CancionPlaylist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_cancion INT NOT NULL,
    id_playlist INT NOT NULL,
    -- constraints
    CONSTRAINT PlaylistSong_FK_Playlist FOREIGN KEY (id_playlist) REFERENCES Playlist(id),
    CONSTRAINT PlaylistSong_FK_Song FOREIGN KEY (id_cancion) REFERENCES Cancion(id)
);
