import React, { useState } from 'react';
import { Button, FormControl, InputGroup, Table } from 'react-bootstrap';

const SongList = ({ songs = [], onEdit, onDelete, onShowDetail, onUpdatePhoto, onUpdateMp3 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSongs = [...songs].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredSongs = sortedSongs.filter(song =>
    song.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artista.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.duracion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar Canción"
          aria-label="Buscar Canción"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('nombre')}>
              Nombre {sortConfig.key === 'nombre' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
            </th>
            <th onClick={() => handleSort('artista')}>
              Artista {sortConfig.key === 'artista' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
            </th>
            <th onClick={() => handleSort('duracion')}>
              Duración {sortConfig.key === 'duracion' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song, index) => (
            <tr key={index}>
              <td>{song.nombre}</td>
              <td>{song.artista}</td>
              <td>{song.duracion}</td>
              <td className="d-flex justify-content-around">
                <Button variant="info" onClick={() => onShowDetail(song)} className="me-2" title="Ver Detalle">
                  <i className="bi bi-eye"></i>
                </Button>
                <Button variant="warning" onClick={() => onEdit(song)} className="me-2" title="Actualizar Canción">
                  <i className="bi bi-pencil-square"></i>
                </Button>
                <Button variant="danger" onClick={() => onDelete(song.nombre)} className="me-2" title="Eliminar Canción">
                  <i className="bi bi-trash"></i>
                </Button>
                <Button variant="secondary" onClick={() => onUpdatePhoto(song)} className="me-2" title="Actualizar Foto">
                  <i className="bi bi-image"></i>
                </Button>
                <Button variant="secondary" onClick={() => onUpdateMp3(song)} title="Actualizar Archivo MP3">
                  <i className="bi bi-file-music"></i>
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