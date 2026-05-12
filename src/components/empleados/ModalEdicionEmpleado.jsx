import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionEmpleado = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  empleadoEditar,
  setEmpleadoEditar,
  actualizarEmpleado
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const manejoCambio = (e) => {
    const { name, value } = e.target;
    setEmpleadoEditar(prev => ({ ...prev, [name]: value }));
  };

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarEmpleado();
    setDeshabilitado(false);
  };

  return (
    <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_empleado"
                  value={empleadoEditar.nombre_empleado}
                  onChange={manejoCambio}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido_empleado"
                  value={empleadoEditar.apellido_empleado}
                  onChange={manejoCambio}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email (no editable)</Form.Label>
            <Form.Control
              type="email"
              value={empleadoEditar.email}
              disabled
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  name="celular"
                  value={empleadoEditar.celular}
                  onChange={manejoCambio}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PIN de acceso</Form.Label>
                <Form.Control
                  type="text"
                  name="pin"
                  value={empleadoEditar.pin}
                  onChange={manejoCambio}
                  maxLength={6}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Rol / Tipo de Empleado *</Form.Label>
            <Form.Select
              name="tipo_empleado"
              value={empleadoEditar.tipo_empleado}
              onChange={manejoCambio}
            >
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
              <option value="mesero">Mesero</option>
              <option value="chef">Chef / Cocinero</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleActualizar}
          disabled={deshabilitado}
        >
          {deshabilitado ? "Actualizando..." : "Actualizar Empleado"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionEmpleado;