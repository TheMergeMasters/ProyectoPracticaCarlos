import React from "react";
import { Table, Spinner, Button } from "react-bootstrap";

const TablaProductos = ({ productos, categorias, abrirModalEdicion, abrirModalEliminacion, cargando }) => {

  const obtenerNombreCategoria = (id) => {
    const cat = categorias?.find((c) => c.id_categoria === id);
    return cat ? cat.nombre_categoria : id;
  };

  return (
    <>
      {cargando ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : productos && productos.length > 0 ? (
        <Table striped borderless hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Categoría</th>
              <th>Precio</th>
              <th className="d-none d-md-table-cell">Imagen</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id_producto}>
                <td>{p.id_producto}</td>
                <td>{p.nombre_producto}</td>
                <td className="d-none d-md-table-cell">{obtenerNombreCategoria(p.categoria_producto)}</td>
                <td>{p.precio_venta}</td>
                <td className="d-none d-md-table-cell">
                  {p.url_imagen ? (
                    <img src={p.url_imagen} alt={p.nombre_producto} style={{ width: 80, height: 60, objectFit: 'cover' }} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="text-center">
                  <Button variant="outline-warning" size="sm" className="m-1" onClick={() => abrirModalEdicion && abrirModalEdicion(p)}>
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => abrirModalEliminacion && abrirModalEliminacion(p)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center">
          <h5>No hay productos para mostrar.</h5>
        </div>
      )}
    </>
  );
};

export default TablaProductos;