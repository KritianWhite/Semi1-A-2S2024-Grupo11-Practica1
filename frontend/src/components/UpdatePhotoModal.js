import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './styles/UpdatePhotoModal.css';
import Swal from 'sweetalert2';

const UpdatePhotoModal = ({ isOpen, onClose, onSave, dataUsuario, idUsuario }) => {
  const [errors, setErrors] = useState({}); //errors del formulario
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');

  const handleCancel = (e) =>{
    setSelectedImage(null);
    setBase64Image('');
    onClose();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //asegurarse de que el archivo no sea mayor a 5MB
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          formProfilePicture: 'El archivo seleccionado es demasiado grande'
        });
      }

      //asegurarse de que el archivo sea jpg, jpeg o png
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors({ formProfilePicture: 'El archivo seleccionado no tiene un formato valido' });
      }

      //convertirmos la imagen a base64 y tambien la mostramos en el modal
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedImage(reader.result);
        setBase64Image(reader.result);
      };
    }
  }

  const handleSubmit = async (e) => {
    // Evitar que el formulario recargue la página
    e.preventDefault();
  };

  if (!isOpen) {
    return null; // No mostrar el modal si no está abierto
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='modal-title'>Actualizar Foto</h2>

        {selectedImage ? (
          <div>
            <img src={selectedImage} alt="Selected" className='profile-photo' />
          </div>
        ) : (
          <div>
            <img src={dataUsuario.url_imagen} alt="Selected" className='profile-photo' />
          </div>
        )
        }
        <div className='form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formProfilePicture">
              <Form.Label>Seleccione una foto</Form.Label>
              <Form.Control
                type="file"
                isInvalid={!!errors.formProfilePicture}
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.formProfilePicture}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 m-1">
              Actualizar
            </Button>
            <Button variant="danger" type="button" className="w-100 m-1" onClick={handleCancel}>
              Cancelar
            </Button>
          </Form>
        </div>

      </div>
    </div>
  );
};

export default UpdatePhotoModal;