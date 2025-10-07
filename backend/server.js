const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pedidosRoutes = require("./routes/pedidos");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🧠 Rotas principais
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/auth", authRoutes);

// 🔍 Rota de teste (opcional)
app.get("/", (req, res) => {
  res.send("✅ API Comandas Online está rodando!");
});

// 🚀 Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
