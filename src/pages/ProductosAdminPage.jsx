import { useState, useEffect } from "react";
import { useFetch, postData, deleteData, updateData } from "../hooks/useApi";
import { Link } from "react-router-dom";

export default function ProductosAdminPage() {
  const [reload, setReload] = useState(false);
  const productos = useFetch("productos", [reload]);
  // 🔄 Dependencia para recargar productos al agregar/eliminar/editar

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = async () => {
    const { nombre, precio, stock, descripcion } = nuevoProducto;
    if (!nombre || !precio || !stock) {
      alert("Nombre, precio y stock son obligatorios.");
      return;
    }

    try {
      await postData("productos", {
        nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        descripcion,
      });
      setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "" });
      alert("Producto agregado exitosamente.");
      setReload(!reload); // Forzar recarga de productos
    } catch (error) {
      alert("Error al agregar producto. Revisa la consola.");
      console.error(error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteData("productos", id);
        alert("Producto eliminado exitosamente.");
        setReload(!reload); // Forzar recarga de productos
      } catch (error) {
        alert("Error al eliminar producto. Revisa la consola.");
        console.error(error);
      }
    }
  };

  const [productoEditando, setProductoEditando] = useState(null);
  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion || "",
    });
  };

  const guardarCambios = async () => {
  const { nombre, precio, stock, descripcion } = nuevoProducto;
  if (!nombre || !precio || !stock) {
    alert("Nombre, precio y stock son obligatorios.");
    return;
  }

  try {
    await updateData("productos", productoEditando.id, {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion,
    });

    alert("Producto actualizado correctamente.");
    setProductoEditando(null);
    setNuevoProducto({ nombre: "", precio: "", stock: "", descripcion: "" });
    setReload(!reload); // 🔁 Recargar productos para ver el cambio reflejado
  } catch (error) {
    alert("Error al actualizar producto. Revisa la consola.");
    console.error(error);
  }
};


  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🛒 Gestión de Productos</h2>

      <div className="card p-4 shadow-sm mb-5">
        <h5 className="mb-3">➕ Agregar nuevo producto</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              name="precio"
              className="form-control"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              name="stock"
              className="form-control"
              placeholder="Stock"
              value={nuevoProducto.stock}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12 mt-3">
            <input
              type="text"
              name="descripcion"
              className="form-control"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="mt-3">
          {productoEditando ? (
              <button className="btn btn-primary" onClick={guardarCambios}>
                Guardar cambios
              </button>
            ) : (
              <button className="btn btn-success" onClick={agregarProducto}>
                Guardar producto
              </button>
            )}

        </div>
      </div>

      <h5 className="mb-3">📋 Lista de productos</h5>
      {productos.length === 0 ? (
        <div className="alert alert-info">No hay productos registrados.</div>
      ) : (
        <ul className="list-group shadow-sm">
          {productos.map((p) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>{p.nombre}</strong> — ${p.precio} - {p.stock} en stock
                {p.descripcion && (
                  <div>
                    <small className="text-muted">{p.descripcion}</small>
                  </div>
                )}
              </div>
              <div className="d-flex flex-row gap-2">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      Eliminar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => editarProducto(p)}
                    >
                      Editar
                    </button>
              </div>

                  </li>
          ))}
        </ul>
      )}

      <div className="text-center mt-5">
        <Link to="/login" className="btn btn-outline-secondary">
          <i className="bi bi-box-arrow-in-left me-2"></i>Volver al login
        </Link>
      </div>
    </div>
  );
}

