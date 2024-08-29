import React from 'react';

const SongDetails = ({ song }) => {
    if (!song) {
        return <p>Seleccione una canción para ver los detalles.</p>;
    }

    return (
        <div className="p-3 bg-light rounded">
            <h4>Detalles de la Canción</h4>
            <p>
                <strong>Nombre:</strong> {song.nombre}
            </p>
            <p>
                <strong>Artista:</strong> {song.artista}
            </p>
            <p>
                <strong>Duración:</strong> {song.duracion}
            </p>
            <img
                src={song.url_caratula}
                alt={song.nombre}
                style={{ width: '100%', borderRadius: '10px' }}
            />
            <audio controls className="mt-3" src={song.url_mp3}></audio>
        </div>
    );
};

export default SongDetails;
