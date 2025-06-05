import { Navigate } from "react-router-dom";
import useStore from "../store/useStore";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, role }) {
  const user = useStore((state) => state.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setChecking(false);
    }, 50); // Espera breve para que Zustand cargue el estado
    return () => clearTimeout(timeout);
  }, []);

  if (checking) return null; // o <div>Cargando...</div> si querés

  if (!user) {
    console.log("No hay usuario → redirigiendo al login");
    return <Navigate to="/login" />;
  }

  if (role && user.rol.toLowerCase() !== role.toLowerCase()) {
    console.log(`Rol incorrecto: esperado "${role}", recibido "${user.rol}"`);
    return <Navigate to="/not-found" />;
  }

  return children;
}



// This component is a protected route that checks if the user is logged in and has the correct role.
// If the user is not logged in, it redirects to the login page.