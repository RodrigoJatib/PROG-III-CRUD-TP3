const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  const { nombre, precio, stock, descripcion } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: "Nombre y precio son obligatorios" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO productos (nombre, precio, stock, descripcion) VALUES (?, ?, ?, ?)",
      [nombre, precio || "", stock || 0, descripcion || ""]
    );
    res.status(201).json({ id: result.insertId, nombre, precio, stock, descripcion });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// PUT /productos/:id → Actualizar producto
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock, descripcion } = req.body;

  const sql = `
    UPDATE productos
    SET nombre = ?, precio = ?, stock = ?, descripcion = ?
    WHERE id = ?
  `;

  db.query(sql, [nombre, precio, stock, descripcion, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar producto:", err);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado exitosamente" });
  });
});

module.exports = router;
