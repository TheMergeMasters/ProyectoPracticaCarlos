import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import React, {useEffect, useState} from "react";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import TablaProductos from "../components/productos/TablaProductos";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import Paginacion from "../components/ordenamiento/Paginacion";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TarjetaProducto from "../components/productos/TarjetaProducto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";



const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    archivo: null,
  });

  
  const [productoEditar, setProductoEditar] = useState({
    id_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    categoria_producto: "",
    precio_venta: "",
    url_imagen: "",
    archivo: null,
  });

  

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre_producto?.toLowerCase() || "";
        const descripcion = prod.descripcion_producto?.toLowerCase() || "";
        const precio = prod.precio_venta?.toString() || "";

        return (
          nombre.includes(textoLower) ||
          descripcion.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    const totalPaginas = Math.max(1, Math.ceil((productosFiltrados.length || 0) / registrosPorPagina));
    if (paginaActual > totalPaginas) {
      establecerPaginaActual(1);
    }
  }, [productosFiltrados, registrosPorPagina, paginaActual]);

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorias:", err);
    }
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("id_producto", { ascending: true });
      if (error) throw error;
      setProductos(data || []);
      setProductosFiltrados(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre_producto.trim() ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje:
            "Completa los campos obligatorios (nombre, categoría, precio e imagen)",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo, {

        });

      if (uploadError) throw uploadError; 

        const {data: urlData} = await supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);
        const urlPublica = urlData.publicUrl;

        const { error } = await supabase.from("productos").insert([
          {
            nombre_producto: nuevoProducto.nombre_producto,
            descripcion_producto: nuevoProducto.descripcion_producto || null,
            categoria_producto: nuevoProducto.categoria_producto,
            precio_venta: parseFloat(nuevoProducto.precio_venta),
            url_imagen: urlPublica,
          },
        ]);

        if (error) throw error;

        // Recargar la lista de productos
        await cargarProductos();

        setNuevoProducto({
          nombre_producto: "",
          descripcion_producto: "",
          categoria_producto: "",
          precio_venta: "",
          archivo: null,
        });
        
        setToast({ mostrar: true, mensaje: "Producto registrado correctamente", tipo: "exito" });

      }catch (err) {
        console.error("Error al agregar producto:", err);
        setToast({ mostrar: true, mensaje: "Error al registrar producto", tipo: "error" });
      }
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto ?? producto.nombre ?? "",
      descripcion_producto:
        producto.descripcion_producto ?? producto.descripcion ?? "",
      categoria_producto: producto.categoria_producto ?? producto.categoria ?? "",
      precio_venta: producto.precio_venta ?? producto.precio ?? "",
      url_imagen: producto.url_imagen ?? producto.imagen ?? "",
      archivo: null,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoEdicion = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const actualizarProducto = async () => {
  try {

    if (
      !productoEditar.nombre_producto.trim() ||
      !productoEditar.categoria_producto ||
      !productoEditar.precio_venta
    ) {
      setToast({
        mostrar: true,
        mensaje: "Completa los campos obligatorios",
        tipo: "advertencia",
      });
      return;
    }

    setMostrarModalEdicion(false);

    let datosActualizados = {
      nombre_producto: productoEditar.nombre_producto,
      descripcion_producto: productoEditar.descripcion_producto || null,
      categoria_producto: productoEditar.categoria_producto,
      precio_venta: parseFloat(productoEditar.precio_venta),
      url_imagen: productoEditar.url_imagen,
    };

    if (productoEditar.archivo) {
      const nombreArchivo = `${Date.now()}_${productoEditar.archivo.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, productoEditar.archivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      datosActualizados.url_imagen = urlData.publicUrl;

      if (productoEditar.url_imagen) {
        const nombreAnterior = productoEditar.url_imagen.split("/").pop().split("?")[0];
        await supabase.storage
          .from("imagenes_productos")
          .remove([nombreAnterior])
          .catch(() => {});
      }
    }

    const { error } = await supabase
      .from("productos")
      .update(datosActualizados)
      .eq("id_producto", productoEditar.id_producto);

    if (error) throw error;

    await cargarProductos();

    setProductoEditar({
      id_producto: "",
      nombre_producto: "",
      descripcion_producto: "",
      categoria_producto: "",
      precio_venta: "",
      url_imagen: "",
      archivo: null,
    });

    setToast({
      mostrar: true,
      mensaje: "Producto actualizado correctamente",
      tipo: "exito",
    });

  } catch (err) {
    console.error("Error al actualizar:", err);
    setToast({
      mostrar: true,
      mensaje: "Error al actualizar producto",
      tipo: "error",
    });
  }
};
  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      setMostrarModalEliminacion(false);
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", productoAEliminar.id_producto)
        .select();

      if (error) throw error;

      await cargarProductos();
      setToast({ mostrar: true, mensaje: `producto "${productoAEliminar.nombre_producto}" eliminado`, tipo: "exito" });
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setToast({ mostrar: true, mensaje: "Error al eliminar producto", tipo: "error" });
    }
  };

  const generarPDFProducto = async (producto, categorias) => {
  const doc = new jsPDF();

  // Función interna para convertir URL de imagen a Base64
  const convertirImagenABase64 = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Evita problemas de CORS con Supabase
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = function () {
        resolve(null); // Si falla la carga, devuelve null para no romper el PDF
      };
      img.src = url;
    });
  };

  // 1. Encabezado del Reporte
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("FICHA TÉCNICA DE PRODUCTO", 14, 20);

  // Línea decorativa
  doc.setDrawColor(0, 123, 255); // Azul institucional
  doc.setLineWidth(1);
  doc.line(14, 24, 195, 24);

  // 2. Obtener Nombre de la Categoría
  const catEncontrada = categorias.find(
    (c) => c.id_categoria === producto.categoria_producto
  );
  const nombreCategoria = catEncontrada ? catEncontrada.nombre_categoria : "Sin categoría";

  // 3. Renderizar la Imagen si existe
  let finalYDeImagen = 30; 
  if (producto.url_imagen) {
    const base64Img = await convertirImagenABase64(producto.url_imagen);
    if (base64Img) {
      // Dibujar imagen (X, Y, Ancho, Alto)
      doc.addImage(base64Img, "JPEG", 14, 30, 50, 50);
      finalYDeImagen = 85; // Espacio que ocupó la imagen + margen
    }
  }

  // 4. Tabla de Datos del Producto
  // Si hay imagen la tabla empieza abajo de ella, si no, empieza en Y: 30
  const startYTabla = producto.url_imagen ? Math.max(30, finalYDeImagen - 55) : 30;
  // Si hay imagen, empujamos la tabla a la derecha (X: 70) para que no se superpongan
  const margenIzquierdoTabla = producto.url_imagen ? 70 : 14;

  autoTable(doc, {
    startY: startYTabla,
    margin: { left: margenIzquierdoTabla },
    styles: { fontSize: 11, cellPadding: 4 },
    headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
    head: [["Especificación", "Detalle"]],
    body: [
      ["ID Producto:", `#${producto.id_producto}`],
      ["Nombre del Artículo:", producto.nombre_producto],
      ["Categoría:", nombreCategoria],
      ["Precio de Venta:", `$${Number(producto.precio_venta).toFixed(2)}`],
      ["Descripción:", producto.descripcion_producto || "Sin descripción disponible."],
    ],
  });

  // 5. Guardar el archivo PDF
  doc.save(`Producto_${producto.id_producto}.pdf`);
};

  return (
    <Container className="mt-3">

      <Row className="align-items-center mb-3">

        <Col className="d-flex align-items-center">
          <h3 className="mb-0">
            <i className="bi-bag-heart-fill me-2"></i> Productos
          </h3>
        </Col>

        <Col xs={3} sm={5} md={5} lg={5} className="text-end">
          <Button onClick={() => setMostrarModal(true)} size="md">
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2">Nuevo Producto</span>
          </Button>
        </Col>
      </Row>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, descripción o precio..."
          />
        </Col>
      </Row>

      <Row>

      <Col xs={12} sm={12} md={12} className="d-lg-none">
        <TarjetaProducto
          productos={productosPaginados}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />
      </Col>

        <Col lg={12} className="d-none d-lg-block">
            <TablaProductos
              productos={productosPaginados}
              categorias={categorias}
              cargando={cargando}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
              generarPDFProducto={(prod) => generarPDFProducto(prod, categorias)} 
            />
          </Col>
      </Row>


      {productosFiltrados.length > 0 && (
        <Row className="mt-3">
          <Col>
            <Paginacion
              registrosPorPagina={registrosPorPagina}
              totalRegistros={productosFiltrados.length}
              paginaActual={paginaActual}
              establecerPaginaActual={establecerPaginaActual}
              establecerRegistrosPorPagina={establecerRegistrosPorPagina}
            />
          </Col>
        </Row>
      )}

      {/* Modales */}

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoEdicion={manejoCambioArchivoEdicion}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        productoAEliminar={productoAEliminar}
        eliminarProducto={eliminarProducto}
      />
    </Container>
  );
};

export default Productos;