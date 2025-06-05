const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /ventas
router.post("/", async (req, res) => {
  const { cliente_id, productos, total, fecha } = req.body;

  try {
    const [ventaResult] = await db.query(
      "INSERT INTO ventas (cliente_id, fecha, total) VALUES (?, ?, ?)",
      [cliente_id, fecha, total]
    );

    const venta_id = ventaResult.insertId;

    for (const p of productos) {
      await db.query(
        "INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unit) VALUES (?, ?, ?, ?)",
        [venta_id, p.id, p.cantidad, p.precio]
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

module.exports = router;