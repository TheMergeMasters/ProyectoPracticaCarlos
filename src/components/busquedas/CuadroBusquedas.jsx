import React from 'react';
import {Form, InputGroup} from 'react-bootstrap';

const CuadroBusquedas = ({textoBusqueda, manejarCambioBusqueda}) => {
  return (
    <InputGroup style={{width: "100%", borderRadius: "0.375rem"}} className="shadow-sm">
      <InputGroup.Text>
        <i className="bi bi-search"></i>
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o descripción..."
        value={textoBusqueda}
        onChange={manejarCambioBusqueda}
        />
    </InputGroup>
  );
};
export default CuadroBusquedas;