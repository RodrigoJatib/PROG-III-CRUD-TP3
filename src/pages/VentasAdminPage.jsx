import { useState } from "react";
import { useFetch, postData } from "../hooks/useApi";

export default function VentasAdminPage() {
  const productos = useFetch("productos");
  const clientes = useFetch("clientes");
  const ventas = useFetch("ventas");

  const [venta, setVenta] = useState({
    clienteId: "",
    productosSeleccionados: [],
  });

  const toggleProducto = (producto) => {
    const seleccionados = venta.productosSeleccionados;
    const existe = seleccionados.find((p) => p.id === producto.id);

    setVenta({
      ...venta,
      productosSeleccionados: existe
        ? seleccionados.filter((p) => p.id !== producto.id)
        : [...seleccionados, producto],
    });
  };

  const registrarVenta = async () => {
    const total = venta.productosSeleccionados.reduce((acc, p) => acc + p.precio, 0);
    const nuevaVenta = {
      clienteId: parseInt(venta.clienteId),
      productos: venta.productosSeleccionados,
      total,
      fecha: new Date().toISOString().split("T")[0],
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
          <select
            className="form-select"
            onChange={(e) => setVenta({ ...venta, clienteId: e.target.value })}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Productos</label>
          <div className="row">
            {productos.map((p) => (
              <div className="col-md-6" key={p.id}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`prod-${p.id}`}
                    onChange={() => toggleProducto(p)}
                    checked={venta.productosSeleccionados.some((item) => item.id === p.id)}
                  />
                  <label className="form-check-label" htmlFor={`prod-${p.id}`}>
                    {p.nombre} <span className="text-muted">(${p.precio})</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong>Total:</strong>
          <span className="badge bg-success fs-5">
            ${venta.productosSeleccionados.reduce((acc, p) => acc + p.precio, 0)}
          </span>
        </div>

        <button className="btn btn-primary w-100" onClick={registrarVenta}>
          💾 Confirmar venta
        </button>
      </div>

      <h5 className="mb-3">📋 Ventas registradas</h5>
      <ul className="list-group shadow-sm">
        {ventas.map((v) => (
          <li key={v.id} className="list-group-item d-flex justify-content-between align-items-center">
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
