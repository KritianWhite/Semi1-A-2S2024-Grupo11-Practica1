-- SCRIPT DATABASE INITIALIZATION  MYSQL

-- eliminar la base de datos si existe
DROP DATABASE IF EXISTS SOUNDSTREAM;

-- Create the database
CREATE DATABASE SOUNDSTREAM;
-- Use the database
USE SOUNDSTREAM;

-- Create the tables


-- Table: Type Users
CREATE TABLE TypeUser (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

-- Table: Users
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    photo VARCHAR(100) NOT NULL, -- ruta de la foto en el bucket de S3
    password VARCHAR(70) NOT NULL,
    email VARCHAR(50) NOT NULL,
    birthdate DATE NOT NULL,
    role INT NOT NULL,
    -- constraints
    CONSTRAINT User_FK_TypeUser FOREIGN KEY (role) REFERENCES TypeUser(id)
);

-- create user admin

INSERT INTO TypeUser (name) VALUES ('admin');
INSERT INTO TypeUser (name) VALUES ('user');
INSERT INTO Users (name, lastname, photo, password, email, birthdate,role) VALUES ('admin', 'admin', 'https://avatars.githubusercontent.com/u/88564832?v=4','admin', 'admin@gmail.com', '2000-01-01',1);

-- Table: Artists
CREATE TABLE Artists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    bio TEXT NOT NULL
);

-- Table: Songs

CREATE TABLE Songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    file VARCHAR(100) NOT NULL, -- ruta del archivo mp3 en el bucket de S3
    cover VARCHAR(100) NOT NULL, -- ruta de la foto en el bucket de S3
    artist_id INT NOT NULL,
    -- constraints
    CONSTRAINT Song_FK_Artist FOREIGN KEY (artist_id) REFERENCES Artists(id)
);

-- Table: LikedSongs

CREATE TABLE LikedSongs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    -- constraints
    CONSTRAINT LikedSong_FK_User FOREIGN KEY (user_id) REFERENCES Users(id),
    CONSTRAINT LikedSong_FK_Song FOREIGN KEY (song_id) REFERENCES Songs(id)
);

-- Table: Playlists
CREATE TABLE Playlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    -- constraints
    CONSTRAINT Playlist_FK_User FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Table: PlaylistSongs
CREATE TABLE PlaylistSongs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    -- constraints
    CONSTRAINT PlaylistSong_FK_Playlist FOREIGN KEY (playlist_id) REFERENCES Playlists(id),
    CONSTRAINT PlaylistSong_FK_Song FOREIGN KEY (song_id) REFERENCES Songs(id)
);
