import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const SongForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        imagen: '',
        duracion: '',
        artista: '',
        mp3: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
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
    };

    const handleSubmit = () => {
        onSubmit(formData);
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
                <Button variant="primary" onClick={handleSubmit}>
                    {initialData ? 'Actualizar' : 'Crear'}
                </Button>
            </div>
        </Form>
    );
};

export default SongForm;
