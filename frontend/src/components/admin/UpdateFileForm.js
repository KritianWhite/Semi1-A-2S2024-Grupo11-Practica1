import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const UpdateFileForm = ({ fileType, onSubmit, onCancel, accept }) => {
    const [fileData, setFileData] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setFileData(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        onSubmit(fileData);
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
