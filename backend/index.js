const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
console.log("Usuarios route:", typeof usuariosRoutes);
console.log("Es función:", typeof usuariosRoutes === "function");

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/usuarios", require("./routes/usuarios"));
app.use("/productos", require("./routes/productos"));
app.use("/ventas", require("./routes/ventas"));

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
