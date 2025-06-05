import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";

export default function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!nombre || !password) {
      alert("Por favor, ingresa usuario y contraseña");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/usuarios");
      const user = res.data.find(
        (u) => u.nombre === nombre && u.password === password
      );

      if (user) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Usuario logueado:", user);
        user.rol === "admin" ? navigate("/admin/productos") : navigate("/cliente");
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      alert("Error en la conexión con el servidor.");
      console.error(error);
    }
  };

  return (
    <div className="bg-light vh-100 w-100 d-flex align-items-center justify-content-center">
      <div
        className="bg-white p-5 rounded shadow text-center"
        style={{ maxWidth: 400, width: "100%" }}
      >
        <h2 className="mb-4">Iniciar sesión</h2>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Usuario"
          className="form-control mb-3"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          className="form-control mb-3"
        />
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Ingresar
        </button>
      </div>
    </div>
  );
}



// This code defines a LoginPage component that allows users to log in to the application.
// It uses the useState hook to manage the state of the username and password inputs.

// The handleLogin function fetches the list of users from the server and checks if the entered username and password match any user.
// If a match is found, it sets the user in the Zustand store and navigates to the admin page if the user is an admin, or to the home page otherwise.