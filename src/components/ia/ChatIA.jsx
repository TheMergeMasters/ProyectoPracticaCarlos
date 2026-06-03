import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Table } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../database/supabaseconfig';

const ChatIA = ({ mostrar, onCerrar }) => {
  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const finChatRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const contextoBaseDatos = `
  Sistema de ventas. 
  Tablas disponibles:
  - categorias (id_categoria, nombre_categoria, descripcion_categoria)
  - clientes (id_cliente, nombre_cliente, apellido_cliente, celular)
  - productos (id_producto, nombre_producto, descripcion_producto, categoria_producto, precio_venta, url_imagen)
  - ventas (id_venta, id_cliente, id_empleado, fecha_venta, metodo_pago, total)
  - detalles_ventas (id_detalle, id_venta, id_producto, cantidad, precio_unitario, subtotal)
  - empleados (id_empleado, nombre_empleado, apellido_empleado, email, celular, tipo_empleado)
  `;

  const enviarConsulta = async () => {
    if (!entrada.trim()) return;

    const mensajeUsuario = { tipo: 'usuario', contenido: entrada };
    setMensajes(prev => [...prev, mensajeUsuario]);
    const consultaActual = entrada;
    setEntrada('');
    setCargando(true);

    try {
      const modelo = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      Eres un experto en PostgreSQL. Genera una consulta SQL válida.
      ${contextoBaseDatos}

      Reglas estrictas:
      - Comprende el lenguaje natural del usuario y corrige errores de redacción o gramática.
      - Solo devuelve consultas SELECT.
      - NO uses punto y coma (;) al final.
      - NO uses markdown, ni sql, ni explicaciones fuera del JSON.
      - Usa alias claros cuando hagas JOIN.
      - Devuelve SOLO el siguiente JSON, nada más:

      {
        "explicacion": "Explicación breve y clara",
        "consulta_sql": "SELECT ...",
        "columnas": ["columna1", "columna2"]
      }

      Consulta del usuario: "${consultaActual}"
      `;

      const resultado = await modelo.generateContent(prompt);
      let texto = resultado.response.text().trim();

      // Limpieza de respuesta generada en caso de que el modelo incluya formato no deseado
      texto = texto.replace(/```[\s\S]*?```/g, '').trim();

      const match = texto.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No se pudo extraer JSON de la IA");

      const respuestaIA = JSON.parse(match[0]);

      let sqlLimpio = respuestaIA.consulta_sql.trim();

      // Limpieza caracteres que puedan causar errores comunes
      sqlLimpio = sqlLimpio.replace(/;\s*$/, '');
      sqlLimpio = sqlLimpio.replace(/\)\s*\)/g, ')');
      sqlLimpio = sqlLimpio.replace(/,\s*\)/g, ')');

      const { data, error } = await supabase.rpc('ejecutar_consulta_segura', {
        query_sql: sqlLimpio
      });

      if (error) {
        console.error("Error Supabase:", error);
        throw new Error(`Error en SQL: ${error.message}`);
      }

      const datosExtraidos = data ? data.map(item => item.datos) : [];

      const mensajeRespuesta = {
        tipo: 'ia',
        explicacion: respuestaIA.explicacion || "Consulta ejecutada correctamente",
        columnas: respuestaIA.columnas || (datosExtraidos.length > 0 ? Object.keys(datosExtraidos[0]) : []),
        datos: datosExtraidos
      };

      setMensajes(prev => [...prev, mensajeRespuesta]);

    } catch (error) {
      console.error("Error completo:", error);
      setMensajes(prev => [...prev, {
        tipo: 'ia',
        explicacion: "No entendí bien tu consulta. Por favor, reformúlala de forma clara.",
        error: true
      }]);
    }

    setCargando(false);
  };

  useEffect(() => {
    finChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  return (
    <Modal show={mostrar} onHide={onCerrar} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Consultas Inteligentes</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "68vh", overflowY: "auto" }}>
        <div className="d-flex flex-column h-100">
          <div className="flex-grow-1 overflow-auto mb-3 pe-2">
            {mensajes.length === 0 && (
              <div className="text-center text-muted mt-5">
                <h5>¿Qué información necesitas?</h5>
                <p className="mt-2">Ejemplos:</p>
                <ul className="text-start">
                  <li>Ventas totales de este mes</li>
                  <li>Los 10 productos más vendidos</li>
                  <li>Clientes que más han comprado</li>
                  <li>Ventas por empleado</li>
                </ul>
              </div>
            )}

            {mensajes.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.tipo === 'usuario' ? 'text-end' : ''}`}>
                <div className={`d-inline-block p-3 rounded-3 ${msg.tipo === 'usuario' ? 'bg-primary text-white' : 'bg-light border'}`}
                  style={{ maxWidth: '90%' }}>
                  <strong>{msg.tipo === 'usuario' ? 'Tú:' : 'Asistente IA:'}</strong><br />
                  
                  {msg.tipo === 'usuario' ? (
                    <p className="mb-0">{msg.contenido}</p>
                  ) : (
                    msg.explicacion
                  )}

                  {msg.datos && msg.datos.length > 0 && (
                    <Table striped bordered hover size="sm" responsive className="mt-3">
                      <thead>
                        <tr>
                          {msg.columnas.map((col, i) => (
                            <th key={i}>{col.replace(/_/g, ' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.datos.map((fila, i) => (
                          <tr key={i}>
                            {msg.columnas.map((col, j) => (
                              <td key={j}>{fila[col]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" /> Procesando consulta...
              </div>
            )}
            <div ref={finChatRef} />
          </div>

          <Form onSubmit={(e) => { e.preventDefault(); enviarConsulta(); }}>
            <div className="d-flex gap-2">
              <Form.Control
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Escribe tu consulta en lenguaje natural..."
                disabled={cargando}
              />
              <Button variant="primary" onClick={enviarConsulta} disabled={cargando || !entrada.trim()}>
                Enviar
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChatIA;