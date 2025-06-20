import { useState, useEffect } from "react";
import { useFetch, postData } from "../hooks/useApi";

export default function VentasAdminPage() {
  const productos = useFetch("productos");
  const ventas = useFetch("ventas");

  const [venta, setVenta] = useState({
    cliente_Id: "",
    productosSeleccionados: [],
    nombreCliente: "",
    contactoCliente: "",
    direccionCliente: "",
  });

  const [filtros, setFiltros] = useState({
    texto: "",
    ordenPrecio: "",
    talle: "",
    categoria: "",
  });

  const [productosFiltrados, setProductosFiltrados] = useState([]);

  useEffect(() => {
    let filtrados = [...productos];

    if (filtros.texto) {
      filtrados = filtrados.filter((p) =>
        p.nombre.toLowerCase().includes(filtros.texto.toLowerCase())
      );
    }

    if (filtros.talle) {
      filtrados = filtrados.filter((p) => p.talle === filtros.talle);
    }

    if (filtros.categoria) {
      filtrados = filtrados.filter((p) => p.categoria === filtros.categoria);
    }

    if (filtros.ordenPrecio === "mayor") {
      filtrados.sort((a, b) => b.precio - a.precio);
    } else if (filtros.ordenPrecio === "menor") {
      filtrados.sort((a, b) => a.precio - b.precio);
    }

    setProductosFiltrados(filtrados);
  }, [filtros, productos]);

  const agregarProducto = (producto, cantidad) => {
    if (cantidad <= 0 || isNaN(cantidad)) return;

    const existe = venta.productosSeleccionados.find((p) => p.id === producto.id);
    if (existe) {
      const actualizados = venta.productosSeleccionados.map((p) =>
        p.id === producto.id ? { ...p, cantidad } : p
      );
      setVenta({ ...venta, productosSeleccionados: actualizados });
    } else {
      setVenta({
        ...venta,
        productosSeleccionados: [
          ...venta.productosSeleccionados,
          { ...producto, cantidad },
        ],
      });
    }
  };

  const eliminarProducto = (id) => {
    const filtrados = venta.productosSeleccionados.filter((p) => p.id !== id);
    setVenta({ ...venta, productosSeleccionados: filtrados });
  };

  const registrarVenta = async () => {
    const total = venta.productosSeleccionados.reduce(
      (acc, p) => acc + p.precio * p.cantidad,
      0
    );

    const nuevaVenta = {
      cliente_Id: venta.cliente_Id ? parseInt(venta.cliente_Id): null,
      productos: venta.productosSeleccionados,
      total,
      fecha: new Date().toISOString().split("T")[0],
      nombreCliente: venta.nombreCliente || "",
      contactoCliente: venta.contactoCliente || "",
      direccionCliente: venta.direccionCliente || "",
    };

    await postData("ventas", nuevaVenta);
    window.location.reload();
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">🧾 Gestión de Ventas</h2>

      <div className="card shadow p-4 mb-5">
        <h5 className="mb-3">📦 Registrar nueva venta</h5>

        <div className="mb-3">
          <label className="form-label fw-semibold">Cliente</label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre del cliente (opcional)"
            onChange={(e) => setVenta({ ...venta, nombreCliente: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Email o contacto (opcional)"
            onChange={(e) => setVenta({ ...venta, contactoCliente: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Dirección (opcional)"
            onChange={(e) => setVenta({ ...venta, direccionCliente: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <h6 className="fw-semibold">🔍 Buscar productos</h6>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Buscar por nombre"
            onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
          />
          <div className="row">
            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, ordenPrecio: e.target.value })}
              >
                <option value="">Ordenar por precio</option>
                <option value="menor">Menor precio</option>
                <option value="mayor">Mayor precio</option>
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, talle: e.target.value })}
              >
                <option value="">Filtrar por talle</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="único">Único</option>
              </select>
            </div>

            <div className="col-md-4">
              <select
                className="form-select mb-2"
                onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              >
                <option value="">Filtrar por categoria</option>
                <option value="Partes de Arriba">Partes de Arriba</option>
                <option value="Partes de Abajo">Partes de Abajo</option>
                <option value="Vestidos y Monos">Vestidos y monos</option>
                <option value="Abrigos">Abrigos</option>
              </select>
            </div>
          </div>
        </div>


          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              backgroundColor: "#f8f9fa",
              marginBottom: "1rem"
            }}
          >
        <div className="row">
          {productosFiltrados.map((p) => (
            <div className="col-md-6 mb-2" key={p.id}>
              <div className="d-flex align-items-center gap-2">
                <span className="flex-grow-1">
                  {p.nombre} (${p.precio}) - {p.talle} / {p.categoria}
                </span>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  style={{ width: "80px" }}
                  placeholder="0"
                  onChange={(e) =>
                    agregarProducto(p, parseInt(e.target.value))
                  }
                />
              </div>
            </div>
          ))}
        </div>
        </div>

        {venta.productosSeleccionados.length > 0 && (
          <>
            <div className="mb-3 mt-3">
              <h6>🛒 Productos seleccionados:</h6>
              <div
                className="overflow-auto"
                style={{
                  maxHeight: "200px",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.5rem",
                }}
              >
                <ul className="list-group list-group-flush">
                  {venta.productosSeleccionados.map((p) => (
                    <li
                      key={p.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {p.nombre} x {p.cantidad} = ${" "}
                        {(p.precio * p.cantidad).toFixed(2)}
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarProducto(p.id)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong>Total:</strong>
              <span className="badge bg-success fs-5">
                $
                {venta.productosSeleccionados.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
                  .toFixed(2)}
              </span>
            </div>
          </>
        )}

        <button className="btn btn-primary w-100" onClick={registrarVenta}>
          💾 Confirmar venta
        </button>
      </div>

      <h5 className="mb-3 text-white">📋 Ventas registradas</h5>
      <ul className="list-group shadow-sm">
        {ventas.map((v) => (
          <li
            key={v.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>Cliente ID:</strong> {v.clienteId} <br />
              <small className="text-muted">Fecha: {v.fecha}</small>
            </div>
            <span className="badge bg-primary fs-6">${v.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


