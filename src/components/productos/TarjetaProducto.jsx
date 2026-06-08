import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProducto = ({
  productos,
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarQRImagen,
  copiarProducto,
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);
  const [productosPorCategoria, setProductosPorCategoria] = useState({});

  useEffect(() => {
    if (productos && productos.length > 0) {
      // Agrupar productos por categoría
      const agrupados = {};
      productos.forEach((prod) => {
        const catId = prod.categoria_producto;
        if (!agrupados[catId]) {
          agrupados[catId] = [];
        }
        agrupados[catId].push(prod);
      });
      setProductosPorCategoria(agrupados);
      setCargando(false);
    } else {
      setCargando(!productos || productos.length === 0);
    }
  }, [productos]);

  const obtenerNombreCategoria = (id) => {
    const cat = categorias?.find((c) => c.id_categoria === id);
    return cat ? cat.nombre_categoria : `Categoría ${id}`;
  };

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const TarjetaProductoItem = ({ producto, nombreCategoria }) => {
    const tarjetaActiva = idTarjetaActiva === producto.id_producto;

    return (
      <Card
        className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-producto-contenedor"
        onClick={() => alternarTarjetaActiva(producto.id_producto)}
        tabIndex={0}
        onKeyDown={(evento) => {
          if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            alternarTarjetaActiva(producto.id_producto);
          }
        }}
        aria-label={`Producto ${producto.nombre_producto}`}
        style={{ cursor: "pointer" }}
      >
        <Card.Body
          className={`p-3 tarjeta-producto-cuerpo ${
            tarjetaActiva
              ? "tarjeta-producto-cuerpo-activa"
              : "tarjeta-producto-cuerpo-inactiva"
          }`}
        >
          <Row className="align-items-start gx-3">
            <Col xs={2} className="text-center">
              <i className="bi bi-bookmark text-primary fs-4"></i>
            </Col>

            <Col xs={7} className="text-start">
              <div className="small text-dark fw-bold mb-1">
                {nombreCategoria}
              </div>
              <div className="fw-semibold text-truncate">
                {producto.nombre_producto}
              </div>
              <div className="small text-muted text-truncate">
                {producto.descripcion_producto || "Sin descripción"}
              </div>
              <div className="small text-muted">
                <strong>Precio: ${producto.precio_venta}</strong>
              </div>
            </Col>

            <Col
              xs={3}
              className="d-flex flex-column align-items-end justify-content-center"
            >
              <div className="badge bg-success">Disponible</div>
            </Col>
          </Row>
        </Card.Body>

        {tarjetaActiva && (
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              e.stopPropagation();
              setIdTarjetaActiva(null);
            }}
            className="tarjeta-producto-capa"
          >
            <div
              className="d-flex gap-2 tarjeta-producto-botones-capa"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => {
                  abrirModalEdicion(producto);
                  setIdTarjetaActiva(null);
                }}
                aria-label={`Editar ${producto.nombre_producto}`}
              >
                <i className="bi bi-pencil"></i> Editar
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  abrirModalEliminacion(producto);
                  setIdTarjetaActiva(null);
                }}
                aria-label={`Eliminar ${producto.nombre_producto}`}
              >
                <i className="bi bi-trash"></i> Eliminar
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  generarQRImagen(producto);
                  setIdTarjetaActiva(null);
                }}
                title="Generar código QR de la imagen"
              >
                <i className="bi bi-qr-code"></i>
              </Button>
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => {
                  if (copiarProducto) {
                    copiarProducto(producto);
                  }
                  setIdTarjetaActiva(null);
                }}
                title="Copiar al portapapeles"
                aria-label={`Copiar ${producto.nombre_producto}`}
              >
                <i className="bi bi-clipboard"></i>
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando productos...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : Object.keys(productosPorCategoria).length > 0 ? (
        <div>
          {Object.keys(productosPorCategoria).map((catId) => (
            <div key={catId}>
              {productosPorCategoria[catId].map((producto) => (
                <TarjetaProductoItem
                  key={producto.id_producto}
                  producto={producto}
                  nombreCategoria={obtenerNombreCategoria(parseInt(catId))}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center my-5">
          <h5>No hay productos para mostrar.</h5>
        </div>
      )}
    </>
  );
};

export default TarjetaProducto;
