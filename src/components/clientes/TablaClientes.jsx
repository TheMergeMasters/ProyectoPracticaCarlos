import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!(clientes && clientes.length > 0));
  }, [clientes]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando clientes...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Celular</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.nombre_cliente}</td>
                <td>{cliente.apellido_cliente || "—"}</td>
                <td>{cliente.celular}</td>
                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(cliente)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(cliente)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="m-1"
                    onClick={() => generarPDFCliente(cliente)}
                  >
                    <i className="bi bi-file-earmark-pdf"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaClientes;