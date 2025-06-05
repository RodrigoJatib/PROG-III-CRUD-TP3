const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /usuarios - Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("ERROR AL OBTENER USUARIOS:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

module.exports = router;

