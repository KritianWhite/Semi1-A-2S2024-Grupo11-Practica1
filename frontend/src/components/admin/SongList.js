import React from 'react';
import { Table, Button } from 'react-bootstrap';

const SongList = ({ songs = [], onEdit, onDelete, onShowDetail, onUpdatePhoto, onUpdateMp3 }) => {
    if (songs.length === 0) {
        return <p>No hay canciones disponibles.</p>;
    }

    return (
        <>
            <Table bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Artista</th>
                        <th>Duración</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song, index) => (
                        <tr key={index}>
                            <td>{song.nombre}</td>
                            <td>{song.artista}</td>
                            <td>{song.duracion}</td>
                            <td className="d-flex justify-content-around">
                                <Button variant="info" onClick={() => onShowDetail(song)} className="me-2" title="Ver Detalle">
                                    <i className="bi bi-eye"></i> {/* Ícono de ver detalle */}
                                </Button>

                                <Button variant="warning" onClick={() => onEdit(song)} className="me-2" title="Actualizar Canción">
                                    <i className="bi bi-pencil-square"></i> {/* Ícono de actualizar */}
                                </Button>

                                <Button variant="danger" onClick={() => onDelete(song.nombre)} className="me-2" title="Eliminar Canción">
                                    <i className="bi bi-trash"></i> {/* Ícono de eliminar */}
                                </Button>

                                <Button variant="secondary" onClick={() => onUpdatePhoto(song)} className="me-2" title="Actualizar Foto">
                                    <i className="bi bi-image"></i> {/* Ícono de actualizar foto */}
                                </Button>

                                <Button variant="secondary" onClick={() => onUpdateMp3(song)} title="Actualizar Archivo MP3">
                                    <i className="bi bi-file-music"></i> {/* Ícono de actualizar MP3 */}
                                </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default SongList;
