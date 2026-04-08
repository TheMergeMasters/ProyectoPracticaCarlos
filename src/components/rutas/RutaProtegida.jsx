import React from "react";
import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
  // Verifica si el usuario está autenticado usando localStorage
  const estaLogueado = !!localStorage.getItem("usuario-supabase");

  // Log para depuración
  console.log("Usuario autenticado:", estaLogueado);

  // Si está autenticado, permite acceso; si no, redirige a login
  return estaLogueado ? children : <Navigate to="/login" replace />;
};

export default RutaProtegida;