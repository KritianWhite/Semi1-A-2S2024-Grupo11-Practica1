import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Alertas from '../Alertas';

const SongForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        url_caratula: '',
        duracion: '',
        artista: '',
        url_mp3: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        try {
            const { name, value, files } = e.target;
            if (name === 'imagen' || name === 'mp3') {
                const reader = new FileReader();
                reader.onload = () => {
                    setFormData({ ...formData, [name]: reader.result });
                };
                reader.readAsDataURL(files[0]);
            } else {
                setFormData({ ...formData, [name]: value });
            }
        } catch (error) {
            console.error(error);
            Alertas.showToast("Error al subir archivo", 'warning');
        }
    };

    const handleSubmit = (typeForm) => { //typeForm 1=crear, 2=actualizar
        // validar que los campos no estén vacíos
        
        if (
            !formData.nombre ||
            !formData.artista ||
            !formData.duracion ||
            !formData.url_caratula ||
            !formData.url_mp3
        ) {
            Alertas.showAlert('Todos los campos son obligatorios', 'error');
        } else {
            const createSong = () => {

                fetch('http://localhost:4000/song/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: formData.nombre,
                        artista: formData.artista,
                        duracion: formData.duracion,
                        imagen: formData.url_caratula,
                        mp3: formData.url_mp3
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === 200) {
                            Alertas.showToast(data.message, 'success');
                            formData.id = data.id_cancion;
                            onSubmit(formData);

                        } else {
                            Alertas.showToast(data.message, 'error');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        Alertas.showToast(error.message, 'error');
                    });
            }

            const updateSong = () => {
                console.log("Entra a actualizar");
                fetch('http://localhost:4000/song/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idcancion: formData.id,
                        nombre: formData.nombre,
                        artista: formData.artista,
                        duracion: formData.duracion
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === 200) {
                            Alertas.showToast(data.message, 'success');
                            onSubmit(formData)
                        } else {
                            Alertas.showToast(data.message, 'error');
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        Alertas.showToast(error.message, 'error');
                    });
            }
            //hacemos la petición al servidor
            if (typeForm === 1) {
                createSong();
            } else if (typeForm === 2) {
                updateSong();
            }


        }
    };

    return (
        <Form>
            <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre de la canción"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formArtista" className="mt-3">
                <Form.Label>Artista</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre del artista"
                    name="artista"
                    value={formData.artista}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formDuracion" className="mt-3">
                <Form.Label>Duración</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="00:00:00"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {!initialData && (
                <>
                    <Form.Group controlId="formImagen" className="mt-3">
                        <Form.Label>Fotografía</Form.Label>
                        <Form.Control
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formMp3" className="mt-3">
                        <Form.Label>Archivo MP3</Form.Label>
                        <Form.Control
                            type="file"
                            name="mp3"
                            accept="audio/*"
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </>
            )}

            <div className="mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2">
                    Cancelar
                </Button>
                {initialData ? (
                    <Button variant="primary" onClick={() => handleSubmit(2)}>
                        Actualizar
                    </Button>
                ) : (
                    <Button variant="primary" onClick={() => handleSubmit(1)}>
                        Crear
                    </Button>
                )}
                {/* <Button variant="primary" onClick={handleSubmit()}>
                    {initialData ? 'Actualizar' : 'Crear'}
                </Button> */}
            </div>
        </Form>
    );
};

export default SongForm;
