import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCliente = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCliente,
  cliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarCliente();
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
        ¿Estás seguro de que deseas eliminar al cliente{" "}
        <strong>
          {cliente?.nombre_cliente} {cliente?.apellido_cliente}
        </strong>
        ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEliminacion(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminar} disabled={deshabilitado}>
          Eliminar Cliente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCliente;