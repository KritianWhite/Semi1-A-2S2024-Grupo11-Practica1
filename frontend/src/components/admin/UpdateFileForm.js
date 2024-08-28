import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Alertas from '../Alertas';

const UpdateFileForm = ({ fileType, onSubmit, onCancel, accept, idSong }) => {
    const [fileData, setFileData] = useState('');

    const handleFileChange = (e) => {
        try {
            // Leer el archivo seleccionado y almacenar su contenido en base64
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setFileData(reader.result);
            };
            reader.readAsDataURL(file);
        } catch (e) {
            Alertas.showToast('Error al cargar el archivo', 'error');
        }
    };

    const handleSubmit = () => {
        // Si no se ha seleccionado un archivo, no se envía la solicitud
        if(!idSong || idSong === undefined) {
            Alertas.showToast('Error al identificar canción', 'error');
            onCancel();
            return;
        }

        if (!fileData) {
            Alertas.showToast('Seleccione un archivo', 'error');
            return;
        }

        let api_uri = 'http://localhost:4000/song/';   
        if (fileType === 'imagen') {
            api_uri += 'updateimage';
        } else {
            api_uri += 'updatemp3';
        }
        //actualizar foto en el servidor
        fetch(api_uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idcancion: idSong, imagen: fileData }),
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    Alertas.showToast('Error al actualizar la foto', 'error');
                }
                return response.json();
            })
            .then((data) => {
                Alertas.showToast(data.message, 'success');
                onSubmit(data.url);
            })
            .catch((error) => {
                console.error('Error:', error);
                Alertas.showToast(error.message, 'error');
            });
    };

    return (
        <Form>
            <Form.Group controlId={`form${fileType}`}>
                <Form.Label>{fileType === 'imagen' ? 'Seleccionar Imagen' : 'Seleccionar Archivo MP3'}</Form.Label>
                <Form.Control type="file" accept={accept} onChange={handleFileChange} />
            </Form.Group>
            <div className="mt-4">
                <Button variant="secondary" onClick={onCancel} className="me-2">
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Actualizar {fileType === 'imagen' ? 'Foto' : 'Archivo MP3'}
                </Button>
            </div>
        </Form>
    );
};

export default UpdateFileForm;
