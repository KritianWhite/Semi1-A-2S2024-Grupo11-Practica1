import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Alertas from '../Alertas';

const PlayListForm = ({ initialData, onSubmit, onCancel, idUser }) => {
    const [formData, setFormData] = useState({
        id: 0,
        nombre: '',
        descripcion: '',
        url_portada: '',
        id_user: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        try {
            const { name, value, files } = e.target;
            if (name === 'url_portada') {
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
            !idUser ||
            !formData.nombre ||
            !formData.descripcion ||
            !formData.url_portada
        ) {
            Alertas.showAlert('Todos los campos son obligatorios', 'error');
        } else {
            const createPlaylist = () => {

                fetch('http://localhost:4000/playlist/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        iduser: idUser,
                        nombre: formData.nombre,
                        descripcion: formData.descripcion,
                        portada: formData.url_portada
                    }),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.status === 200) {
                            Alertas.showToast(data.message, 'success');
                            formData.id = data.id;
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

            const updatePlaylist = () => {
                console.log("Entra a actualizar");
                fetch('http://localhost:4000/playlist/modify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        iduser: idUser,
                        idplaylist: formData.id,
                        nombre: formData.nombre,
                        descripcion: formData.descripcion
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
                createPlaylist();
            } else if (typeForm === 2) {
                updatePlaylist();
            }


        }
    };

    return (
        <Form>
            <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingresa el nombre de la playlist"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Form.Group controlId="formDescripcion" className="mt-3">
                <Form.Label>Descripcion</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="Ingresa una descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                />
            </Form.Group>

            {!initialData && (
                <>
                    <Form.Group controlId="formImagen" className="mt-3">
                        <Form.Label>Portada</Form.Label>
                        <Form.Control
                            type="file"
                            name="url_portada"
                            accept="image/*"
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

export default PlayListForm;
