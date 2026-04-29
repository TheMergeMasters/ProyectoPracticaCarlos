import React from "react";
import  Pagination  from "react-bootstrap/Pagination";
import {Row, Col, Form } from "react-bootstrap";

const Paginacion = ({
  registrosPorPagina,
  totalRegistros,
  paginaActual,
  establecerPaginaActual,
  establecerRegistrosPorPagina,
}) => {
  // Calcular el total de páginas
const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

// Cambiar de página
const cambiarPagina = (numeroPagina) => {
  if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
    establecerPaginaActual(numeroPagina);
  }
};

// Cambiar la cantidad de registros por página
const cambiarCantidadRegistros = (evento) => {
  establecerRegistrosPorPagina(Number(evento.target.value));
  establecerPaginaActual(1);
};

// Generar los botones de paginación
const elementosPaginacion = [];
const maximoPaginasAMostrar = 3;

let paginaInicio = Math.max(
  1,
  paginaActual - Math.floor(maximoPaginasAMostrar / 2)
);

let paginaFin = Math.min(
  totalPaginas,
  paginaInicio + maximoPaginasAMostrar - 1
);

if (paginaFin - paginaInicio + 1 < maximoPaginasAMostrar) {
  paginaInicio = Math.max(
    1,
    paginaFin - maximoPaginasAMostrar + 1
  );
}

for (let numeroPagina = paginaInicio; numeroPagina <= paginaFin; numeroPagina++) {
  elementosPaginacion.push(
    <Pagination.Item
      key={numeroPagina}
      active={numeroPagina === paginaActual}
      onClick={() => cambiarPagina(numeroPagina)}
    >
      {numeroPagina}
    </Pagination.Item>
  );
}
  return (
    <Row className="mt-1 align-items-center">

  {/* Selector de cantidad de registros */}
  <Col xs="auto">
    <Form.Select
      size="sm"
      value={registrosPorPagina}
      onChange={cambiarCantidadRegistros}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={500}>500</option>
    </Form.Select>
  </Col>

  {/* Controles de paginación */}
  <Col className="d-flex justify-content-center">
    <Pagination className="shadow-sm mt-2">

      <Pagination.First
        onClick={() => cambiarPagina(1)}
        disabled={paginaActual === 1}
      />

      <Pagination.Prev
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
      />

      {paginaInicio > 1 && <Pagination.Ellipsis />}

      {elementosPaginacion}

      {paginaFin < totalPaginas && <Pagination.Ellipsis />}

      <Pagination.Next
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
      />

      <Pagination.Last
        onClick={() => cambiarPagina(totalPaginas)}
        disabled={paginaActual === totalPaginas}
      />

    </Pagination>
  </Col>

</Row>

  );
};
export default Paginacion;