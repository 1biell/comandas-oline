const express = require("express");
const cors = require("cors");
const pedidosRoutes = require("./routes/pedidos");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/pedidos", pedidosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});
