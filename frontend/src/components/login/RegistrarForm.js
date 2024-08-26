// src/components/RegisterForm.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Alertas from '../Alertas';

function RegisterForm() {
  const [errors, setErrors] = useState({});
  const [base64, setBase64] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (event) => {

    const file = event.target.files[0];

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const password = form.elements.formPassword.value;
    const confirmPassword = form.elements.formConfirmPassword.value;
    let formErrors = {};

    if (password !== confirmPassword) {
      formErrors.formPassword = 'Las contraseñas no coinciden';
      formErrors.formConfirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      // Petición a la API para registrar al usuario
      fetch('http://localhost:4000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: form.elements.formFirstName.value,
          apellido: form.elements.formLastName.value,
          imagen: base64,
          email: form.elements.formEmail.value,
          password: form.elements.formPassword.value,
          nacimiento: form.elements.formBirthDate.value,
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status !== 200) {
            Alertas.showToast(data.message, 'error');
          } else {
            Alertas.showToast(data.message, 'success');
            navigate('/Login');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          Alertas.showToast(error, 'error');
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formFirstName">
        <Form.Label>Nombres</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tus nombres"
          isInvalid={!!errors.formFirstName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formFirstName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formLastName">
        <Form.Label>Apellidos</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tus apellidos"
          isInvalid={!!errors.formLastName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formLastName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formProfilePicture">
        <Form.Label>Foto del usuario</Form.Label>
        <Form.Control
          type="file"
          isInvalid={!!errors.formProfilePicture}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formProfilePicture}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu correo electrónico"
          isInvalid={!!errors.formEmail}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formEmail}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Ingresa una contraseña"
          isInvalid={!!errors.formPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formConfirmPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirma tu contraseña"
          isInvalid={!!errors.formConfirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formConfirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBirthDate">
        <Form.Label>Fecha de nacimiento</Form.Label>
        <Form.Control
          type="date"
          isInvalid={!!errors.formBirthDate}
        />
        <Form.Control.Feedback type="invalid">
          {errors.formBirthDate}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Registrarse
      </Button>
      <br/>
      <br/>
      <a href="/Login" className="text-primary">Iniciar sesión</a>
    </Form>
  );
}

export default RegisterForm;
