import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificacionOperacion = ({ mostrar, mensaje, tipo, onCerrar }) => {
  const [visible, setVisible] = useState(mostrar);

  useEffect(() => {
    setVisible(mostrar);
  }, [mostrar]);

  const fechaLocal = () => {
    const f = new Date();
    const fecha = new Date(f);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${dia}-${mes}-${anio} ${fecha.toTimeString().slice(0, 5)}`;
  };

  return (
    <ToastContainer position="top-center" className="p-3">
      <Toast
        onClose={() => {
          setVisible(false);
          onCerrar();
        }}
        show={visible}
        delay={2500}
        autohide
        bg={tipo === 'exito' ? 'success' : tipo === 'advertencia' ? 'warning' : 'danger'}
      >
        <Toast.Header>
          <strong className="me-auto">
            {tipo === 'exito' ? '✅ Éxito' : tipo === 'advertencia' ? '⚠️ Advertencia' : '❌ Error'}
          </strong>
          <small>{fechaLocal()}</small>
        </Toast.Header>
        <Toast.Body className={tipo === 'exito' || tipo === 'error' ? 'text-white' : ''}>
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default NotificacionOperacion;