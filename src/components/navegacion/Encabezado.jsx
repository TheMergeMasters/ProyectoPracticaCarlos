import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  // Detectar rutas especiales
  const esLogin = location.pathname === "/login";
  const esCatalogo =
    location.pathname === "/catalogo" &&
    localStorage.getItem("usuario-supabase") === null;

  // Contenido del menú
  let contenidoMenu;

  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link
          onClick={() => manejarNavegacion("/login")}
          className={mostrarMenu ? "color-texto-marca" : "text-white"}
        >
          <i className="bi-person-fill-lock me-2"></i>
          Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else {
    if (esCatalogo) {
      contenidoMenu = (
        <Nav className="ms-auto pe-2">
          <Nav.Link
            onClick={() => manejarNavegacion("/catalogo")}
            className={mostrarMenu ? "color-texto-marca" : "text-white"}
          >
            <i className="bi-images me-2"></i>
            <strong>Catálogo</strong>
          </Nav.Link>
        </Nav>
      );
    } else {
      contenidoMenu = (
        <>
          <Nav className="ms-auto pe-2">
            <Nav.Link
              onClick={() => manejarNavegacion("/")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-house-fill me-2"></i> : null}
              <strong>Inicio</strong>
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/categorias")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-bookmark-fill me-2"></i> : null}
              <strong>Categorías</strong>
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/productos")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-bag-heart-fill me-2"></i> : null}
              <strong>Productos</strong>
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/empleados")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-person-fill me-2"></i> : null}
              <strong>Empleados</strong>
            </Nav.Link>

            {/* Opción para ir al catálogo público desde admin */}
            <Nav.Link
              onClick={() => manejarNavegacion("/catalogo")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-images me-2"></i> : null}
              <strong>Catálogo</strong>
            </Nav.Link>


            <Nav.Link
              onClick={() => manejarNavegacion("/clientes")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-person-fill me-2"></i> : null}
              <strong>Clientes</strong>
            </Nav.Link>

            <Nav.Link
              onClick={() => manejarNavegacion("/ventas")}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              {mostrarMenu ? <i className="bi-bag-heart-fill me-2"></i> : null}
              <strong>Ventas</strong>
            </Nav.Link>

          {/* Ícono cerrar sesión en barra superior */}
          {mostrarMenu ? null : (
            <Nav.Link
              onClick={cerrarSesion}
              className={mostrarMenu ? "color-texto-marca" : "text-white"}
            >
              <i className="bi-box-arrow-right me-2"></i>
            </Nav.Link>
          )}

          <hr />
          </Nav>

          {/* Información de usuario y botón cerrar sesión */}
          {mostrarMenu && (
            <div className="mt-3 p-3 rounded bg-light text-dark">
              <p className="mb-2">
                <i className="bi-envelope-fill me-2"></i>
                {localStorage.getItem("usuario-supabase")?.toLowerCase() ||
                  "Usuario"}
              </p>
              <button
                className="btn btn-outline-danger mt-3 w-100"
                onClick={cerrarSesion}
              >
                <i className="bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </button>
            </div>
          )}
        </>
      );
    }
  }

  return (
    <Navbar
      expand="md"
      fixed="top"
      className="color-navbar shadow-lg"
      variant="dark"
    >
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion(esCatalogo ? "/catalogo" : "/")}
          className="text-white fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            alt=""
            src={logo}
            width="45"
            height="45"
            className="d-inline-block me-2"
          />
          <strong>
            <h4 className="mb-0">Discosa</h4>
          </strong>
        </Navbar.Brand>

        {/* Botón del menú */}
        {!esLogin && (
          <Navbar.Toggle
            aria-controls="menu-offcanvas"
            onClick={manejarToggle}
          />
        )}

        {/* Menú lateral */}
        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú Discosa</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>{contenidoMenu}</Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;