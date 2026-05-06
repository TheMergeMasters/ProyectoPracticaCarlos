import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditar,
  manejoCambioInputEdicion,
  manejoCambioArchivoEdicion,
  actualizarProducto,
  categorias,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="categoria_producto"
                  value={productoEditar.categoria_producto || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                >
                  <option value="">Seleccione...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre_producto"
                  value={productoEditar.nombre_producto || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Precio de venta *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio_venta"
                  value={productoEditar.precio_venta || ""}
                  onChange={manejoCambioInputEdicion}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={12}>
              <Form.Group className="mb-3 text-center">
                <Form.Label>Imagen actual</Form.Label>
                {productoEditar.url_imagen ? (
                  <div className="mb-2">
                    <img
                      src={productoEditar.url_imagen}
                      alt="Producto actual"
                      style={{
                        maxWidth: "120px",
                        maxHeight: "120px",
                        objectFit: "cover",
                        borderRadius: "6px"
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-muted">Sin imagen</p>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nueva imagen (opcional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={manejoCambioArchivoEdicion}
                />
                <Form.Text className="text-muted">
                  Si seleccionas una nueva imagen, reemplazará la actual
                </Form.Text>
              </Form.Group>
            </Col>

            <Col xs={12} md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="descripcion_producto"
                  value={productoEditar.descripcion_producto || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="Descripción del producto (opcional)"
                />
              </Form.Group>
            </Col>

          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEdicion(false)}
          disabled={deshabilitado}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleActualizar}
          disabled={
            deshabilitado ||
            !productoEditar.nombre_producto?.trim() ||
            !productoEditar.categoria_producto ||
            !productoEditar.precio_venta
          }
        >
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;