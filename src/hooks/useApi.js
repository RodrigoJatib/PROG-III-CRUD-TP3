import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

// 🔹 GET - Hook personalizado
export function useFetch(endpoint, deps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/${endpoint}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error al obtener datos:", err));
  }, [endpoint, deps]);

  return data;
}

// 🔹 POST - Crear nuevo recurso
export async function postData(endpoint, data) {
  try {
    const res = await axios.post(`${API_URL}/${endpoint}`, data);
    return res.data;
  } catch (error) {
    console.error("Error en POST:", error);
    throw error;
  }
}

// 🔹 PUT - Actualizar recurso existente
export async function updateData(endpoint, id, data) {
  try {
    const res = await axios.put(`${API_URL}/${endpoint}/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

// 🔹 DELETE - Eliminar recurso
export async function deleteData(endpoint, id) {
  try {
    const res = await axios.delete(`${API_URL}/${endpoint}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}



// This code defines a custom React hook `useFetch` that fetches data from a specified endpoint using Axios.
// It also includes functions for posting, updating, and deleting data from the server.
// The `useFetch` hook initializes state for the data and uses the `useEffect` hook to fetch data from the server when the component mounts or when the endpoint changes.
// The `BASE_URL` is set to "http://localhost:3000", which is the base URL for the API.
