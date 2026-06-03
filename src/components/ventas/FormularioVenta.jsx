import React, { useState } from "react";
import { Modal, Row, Col, Form, Button, Card, ListGroup } from "react-bootstrap";

const FormularioVenta = ({
  mostrar,
  setMostrar,
  clientes,
  empleados,
  productos,
  clienteSeleccionado,
  setClienteSeleccionado,
  empleadoSeleccionado,
  setEmpleadoSeleccionado,
  metodoPago,
  setMetodoPago,
  detalles,
  totalGeneral,
  agregarDetalle,
  eliminarDetalle,
  actualizarCantidad,
  guardarVenta,
  ventaAEditar
}) => {

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const handleAgregar = () => {
    if (productoSeleccionado && cantidad > 0) {
      agregarDetalle(productoSeleccionado, cantidad);
      setCantidad(1);
      setProductoSeleccionado(null);
    }
  };

  return (
    <Modal show={mostrar} onHide={() => setMostrar(false)} backdrop="static" size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {ventaAEditar ? "Editar Venta" : "Nueva Venta"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* === LADO IZQUIERDO (Formulario) === */}
          <Col lg={7} md={6}>
            <h5>Datos de la Venta</h5>

            <Form.Group className="mb-3">
              <Form.Label>Cliente *</Form.Label>
              <Form.Select
                value={clienteSeleccionado?.id_cliente || ""}
                onChange={(e) => {
                  const cliente = clientes.find(c => c.id_cliente === Number(e.target.value));
                  setClienteSeleccionado(cliente);
                }}
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(cli => (
                  <option key={cli.id_cliente} value={cli.id_cliente}>
                    {cli.nombre_cliente} {cli.apellido_cliente} - {cli.celular}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Empleado / Mesero *</Form.Label>
              <Form.Select
                value={empleadoSeleccionado?.id_empleado || ""}
                onChange={(e) => {
                  const emp = empleados.find(em => em.id_empleado === Number(e.target.value));
                  setEmpleadoSeleccionado(emp);
                }}
              >
                <option value="">Seleccionar empleado...</option>
                {empleados.map(emp => (
                  <option key={emp.id_empleado} value={emp.id_empleado}>
                    {emp.nombre_empleado} {emp.apellido_empleado}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
            </Form.Group>

            <hr />
            <h5>Agregar Producto</h5>

            <Row className="align-items-end">
              <Col sm={6}>
                <Form.Select
                  value={productoSeleccionado?.id_producto || ""}
                  onChange={(e) => {
                    const prod = productos.find(p => p.id_producto === Number(e.target.value));
                    setProductoSeleccionado(prod);
                  }}
                >
                  <option value="">Seleccionar producto...</option>
                  {productos.map(p => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre_producto} - C${p.precio_venta}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={3}>
                <Form.Control
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </Col>
              <Col sm={3}>
                <Button variant="success" className="w-100" onClick={handleAgregar} disabled={!productoSeleccionado}>
                  Agregar
                </Button>
              </Col>
            </Row>
          </Col>

          {/* === LADO DERECHO (Detalles + Total) === */}
          <Col lg={5} md={6}>
            <Card className="h-100">
              <Card.Header>
                <strong>Productos en esta venta</strong>
              </Card.Header>
              <Card.Body className="p-0" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {detalles.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-cart-x fs-1"></i>
                    <p>No hay productos agregados aún</p>
                  </div>
                ) : (
                  <ListGroup variant="flush">
                    {detalles.map((det) => (
                      <ListGroup.Item key={det.id_producto} className="d-flex justify-content-between align-items-center">
                        <div>
                          <div>{det.nombre_producto}</div>
                          <small className="text-muted">
                            {det.cantidad} × C${det.precio}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">C$ {(det.cantidad * det.precio).toFixed(2)}</div>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="mt-1"
                            onClick={() => eliminarDetalle(det.id_producto)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center fs-4 fw-bold">
                  <span>Total:</span>
                  <span className="text-success">C$ {totalGeneral.toFixed(2)}</span>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrar(false)}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={guardarVenta}
          disabled={!clienteSeleccionado || !empleadoSeleccionado || detalles.length === 0}
        >
          Registrar Venta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioVenta;
