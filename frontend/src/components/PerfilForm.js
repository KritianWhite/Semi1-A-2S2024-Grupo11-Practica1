import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import Alertas from './Alertas';
import UpdatePhotoModal from './UpdatePhotoModal';
import './styles/PerfilForm.css';

const PerfilForm = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Valores por defecto para evitar fallos si el objeto viene vacío o con campos faltantes
  const defaultData = {
    nombre: '',
    apellido: '',
    url_imagen: '',
    email: '',
    nacimiento: '',
    admin: 0,
  };

  const [formData, setFormData] = useState({ ...defaultData, ...data });
  const [formDataServer, setFormDataServer] = useState({ ...defaultData, ...data }); //datos originales del servidor por si se cancela la edicion
  const [isModalOpen, setIsModalOpen] = useState(false); //estado para abrir y cerrar el modal de cambio de foto
  const [userId, setUserId] = useState(0);
  const [password, setPassword] = useState('');

  const handleModalOpen = () => { //funcion para abrir el modal de cambio de foto
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSavePhoto = () => { //funcion para consultar la api y obtener la nueva foto
    fetch(`http://localhost:4000/user/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setFormDataServer(data);
        //actualizamos la imagen
      })
      .catch((error) => {
        console.error('Error:', error);
        Alertas.showToast('Ocurrío un error al cargar la información', 'error');
      });
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }

  useEffect(() => {
    //obtenemos la informacion del usuario desde el local storage
    const storedAuthData = JSON.parse(localStorage.getItem('authData'));

    //si no hay informacion del usuario redirigimos al login
    if (!storedAuthData.userId) {
      window.location.href = '/login';
    }

    //guardamos el id del usuario
    setUserId(storedAuthData.userId);
    //obtenemos la informacion del usuario haciendo una peticion al servidor
    fetch(`http://localhost:4000/user/getuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: storedAuthData.userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
        setFormDataServer(data);
      })
      .catch((error) => {
        console.error('Error:', error);
        Alertas.showToast('Ocurrío un error al cargar la información', 'error');
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    if (password === '') {
      Alertas.showAlert('Debe ingresar su contraseña para guardar los cambios', 'error');
      setFormData(formDataServer);
      setPassword('');
      return;
    }
    // Guardar cambios de datos editados en la base de datos
    fetch(`http://localhost:4000/user/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        nacimiento: formData.nacimiento,
        password: password
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          Alertas.showToast(data.message, 'success');
          setFormDataServer(formData);
          setFormData(formData);
          setPassword('');
        } else {
          setFormData(formDataServer);
          setPassword('');
          Alertas.showToast(data.message, 'error');
        }
      })
      .catch((error) => {
        setFormData(formDataServer);
        setPassword('');
        console.error('Error:', error);
        Alertas.showToast(error.message, 'error');
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Restaurar los valores originales si se cancela la edición
    setFormData({ ...formDataServer, ...data });
    setPassword('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <Card style={{ borderRadius: '10px', padding: '15px', backgroundColor: '#F8F9FA', position: 'relative', minWidth: '700px' }}>
        <Card.Body>
          <Card.Title style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            PERFIL DE USUARIO
            <Button
              variant="link"
              style={{ position: 'absolute', top: '15px', right: '15px' }}
              onClick={handleEditClick}
              disabled={isEditing}
            >
              <i className="bi bi-pencil"></i>
            </Button>
          </Card.Title>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Nombre:</strong> {isEditing ? <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.nombre}</span>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Apellido:</strong> {isEditing ? <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.apellido}</span>}
                </ListGroup.Item>
                {!isEditing && (
                  <ListGroup.Item>
                    <strong>Correo:</strong> {isEditing ? <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.email}</span>}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>Nacimiento:</strong> {isEditing ? <Form.Control type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.nacimiento}</span>}
                </ListGroup.Item>
                {isEditing && (
                  <ListGroup.Item>
                    <strong>Password:</strong> {isEditing ? <Form.Control type="password" name="password" value={password} onChange={handleChangePassword} /> : <span style={{ marginLeft: '10px' }}>{password}</span>}
                  </ListGroup.Item>
                )}
                {/* <ListGroup.Item>
                <strong>Admin:</strong> {formData.admin === 1 ? 'Yes' : 'No'}
              </ListGroup.Item> */}
              </ListGroup>
            </Col>
            <Col md={4} className="text-center">
              <div className='image-container'>
                <img
                  src={formData.url_imagen || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="}
                  alt="Profile"
                  style={{ width: '100%', height: 'auto' }}
                  onClick={handleModalOpen}
                />
                <div className="hover-text" onClick={handleModalOpen}>Cambiar foto</div>
              </div>
            </Col>
          </Row>
          {isEditing && (
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button variant="primary" onClick={handleSaveClick} style={{ marginRight: '10px' }}>
                Guardar cambios
              </Button>
              <Button variant="secondary" onClick={handleCancelClick}>
                Cancelar
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <UpdatePhotoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSavePhoto}
        dataUsuario={formDataServer}
        idUsuario={userId}
      />
    </div>
  );
};

export default PerfilForm;
