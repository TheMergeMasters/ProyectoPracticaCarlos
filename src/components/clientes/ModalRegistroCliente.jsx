import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCliente = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarCliente();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nuevo Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="nombre_cliente"
              value={nuevoCliente.nombre_cliente}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido_cliente"
              value={nuevoCliente.apellido_cliente}
              onChange={manejoCambioInput}
              placeholder="Ingresa el apellido"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Celular *</Form.Label>
            <Form.Control
              type="tel"
              name="celular"
              value={nuevoCliente.celular}
              onChange={manejoCambioInput}
              placeholder="Ej: 505 1234 5678"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={!nuevoCliente.nombre_cliente.trim() || !nuevoCliente.celular.trim() || deshabilitado}
        >
          Guardar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroCliente;