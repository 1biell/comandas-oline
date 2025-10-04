const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");

router.get("/", pedidosController.listarPedidos);
router.post("/", pedidosController.criarPedido);
router.patch("/:id", pedidosController.atualizarStatus);
router.get("/concluidos", pedidosController.listarPedidosConcluidos);

module.exports = router;
