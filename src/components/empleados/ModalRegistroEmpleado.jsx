import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroEmpleado = ({
  mostrarModal,
  setMostrarModal,
  nuevoEmpleado,
  setNuevoEmpleado,
  agregarEmpleado
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const manejoCambio = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarEmpleado();
    setDeshabilitado(false);
  };

  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Empleado</Modal.Title>
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
                  value={nuevoEmpleado.nombre_empleado}
                  onChange={manejoCambio}
                  placeholder="Nombre"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido_empleado"
                  value={nuevoEmpleado.apellido_empleado}
                  onChange={manejoCambio}
                  placeholder="Apellido"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email (Usuario de acceso) *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={nuevoEmpleado.email}
              onChange={manejoCambio}
              placeholder="ejemplo@discosa.com"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={nuevoEmpleado.password}
              onChange={manejoCambio}
              placeholder="Contraseña de acceso"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  name="celular"
                  value={nuevoEmpleado.celular}
                  onChange={manejoCambio}
                  placeholder="Número de celular"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>PIN de acceso</Form.Label>
                <Form.Control
                  type="text"
                  name="pin"
                  value={nuevoEmpleado.pin}
                  onChange={manejoCambio}
                  placeholder="PIN"
                  maxLength={6}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Rol / Tipo de Empleado *</Form.Label>
            <Form.Select
              name="tipo_empleado"
              value={nuevoEmpleado.tipo_empleado}
              onChange={manejoCambio}
            >
              <option value="">Selecciona un rol</option>
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
              <option value="mesero">Mesero</option>
              <option value="chef">Chef / Cocinero</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleGuardar}
          disabled={deshabilitado}
        >
          {deshabilitado ? "Guardando..." : "Guardar Empleado"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroEmpleado;