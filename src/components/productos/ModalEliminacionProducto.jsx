import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  productoAEliminar,
  eliminarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarProducto();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de eliminar el producto "
        <strong>{productoAEliminar?.nombre_producto}</strong>"?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
          disabled={deshabilitado}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar} disabled={deshabilitado}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;