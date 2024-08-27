import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import Alertas from './Alertas';
import UpdatePhotoModal from './UpdatePhotoModal';

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

  const handleModalOpen = () => { //funcion para abrir el modal de cambio de foto
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSavePhoto = () => { //funcion para consultar la api y obtener la nueva foto

  };

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
        console.log(data);
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
    // Guardar cambios de datos editados en la base de datos
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Restaurar los valores originales si se cancela la edición
    setFormData({ ...formDataServer, ...data });
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
                <ListGroup.Item>
                  <strong>Correo:</strong> {isEditing ? <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.email}</span>}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Nacimiento:</strong> {isEditing ? <Form.Control type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} /> : <span style={{ marginLeft: '10px' }}>{formData.nacimiento}</span>}
                </ListGroup.Item>
                {/* <ListGroup.Item>
                <strong>Admin:</strong> {formData.admin === 1 ? 'Yes' : 'No'}
              </ListGroup.Item> */}
              </ListGroup>
            </Col>
            <Col md={4} className="text-center">
              <div style={{ borderRadius: '50%', overflow: 'hidden', width: '100px', height: '100px', margin: '0 auto' }}>
                <img
                  src={formData.url_imagen || "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="}
                  alt="Profile"
                  style={{ width: '100%', height: 'auto' }}
                  onClick={handleModalOpen}
                />
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
