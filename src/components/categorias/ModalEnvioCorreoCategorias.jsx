import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEnvioCorreoCategorias = ({
  mostrarModalCorreo,
  setMostrarModalCorreo,
  emailDestino,
  setEmailDestino,
  enviandoCorreo,
  enviarCorreoCategorias,
  totalCategorias
}) => {
  return (
    <Modal
      show={mostrarModalCorreo}
      onHide={() => setMostrarModalCorreo(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Enviar Listado de Categorías por Correo
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Correo Destino</Form.Label>
          <Form.Control
            type="email"
            placeholder="ejemplo@correo.com"
            value={emailDestino}
            onChange={(e) => setEmailDestino(e.target.value)}
          />
        </Form.Group>

        <small className="text-muted">
          Se enviará el listado completo de{" "}
          <strong>{totalCategorias}</strong> categorías.
        </small>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalCorreo(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={enviarCorreoCategorias}
          disabled={enviandoCorreo}
        >
          {enviandoCorreo ? "Enviando..." : "Enviar Correo"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEnvioCorreoCategorias;