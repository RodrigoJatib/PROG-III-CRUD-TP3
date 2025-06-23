const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /ventas
router.post("/", async (req, res) => {
  const { cliente_id, productos, total, fecha, nombreCliente, contactoCliente, direccionCliente } = req.body;

  try {
    const [ventaResult] = await db.query(
      "INSERT INTO ventas (cliente_id, fecha, total, nombre_cliente, contacto_cliente, direccion_cliente) VALUES (?, ?, ?, ?, ?, ?)",
  [cliente_id || null, fecha, total, nombreCliente, contactoCliente, direccionCliente]
    );

    const venta_id = ventaResult.insertId;

    for (const p of productos) {
      await db.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unit, nombre_cliente, contacto_cliente, direccion_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [venta_id, p.id, p.cantidad, p.precio, nombreCliente, contactoCliente, direccionCliente]
      );

      await db.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [p.cantidad, p.id]
      );
    }

    res.json({ message: "Venta registrada", venta_id });
  } catch (err) {
    res.status(500).json({ error: "Error al registrar venta" });
  }
});

// GET /ventas - Listar todas las ventas
router.get("/", async (req, res) => {
  try {
    const [ventas] = await db.query(`
    SELECT 
    id,
    fecha,
    total,
    nombre_cliente AS nombreCliente,
    contacto_cliente AS contactoCliente,
    direccion_cliente AS direccionCliente
  FROM ventas
`);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ventas" });
  }
});

// GET/filtrar Ventas Realizadas
router.get("/filtrar", async (req, res) => {
  const { nombre, fecha, producto } = req.query;

  try {
    const [ventas] = await db.query(
      `SELECT 
        v.id AS ventaId,
        v.fecha,
        v.total,
        v.nombre_cliente AS nombreCliente,
        v.contacto_cliente AS contactoCliente,
        v.direccion_cliente AS direccionCliente,
        p.nombre AS nombreProducto,
        dv.cantidad,
        dv.precio_unit
      FROM ventas v
      JOIN detalle_ventas dv ON v.id = dv.venta_id
      JOIN productos p ON dv.producto_id = p.id
      WHERE
        (? IS NULL OR v.nombre_cliente LIKE ?)
        AND (? IS NULL OR v.fecha = ?)
        AND (? IS NULL OR p.nombre LIKE ?)
      ORDER BY v.fecha DESC`,
      [
        nombre || null, `%${nombre || ""}%`,
        fecha || null, fecha || null,
        producto || null, `%${producto || ""}%`
      ]
    );

    res.json(ventas);
  } catch (err) {
    console.error("Error al filtrar ventas:", err);
    res.status(500).json({ error: "Error al filtrar ventas" });
  }
});


module.exports = router;