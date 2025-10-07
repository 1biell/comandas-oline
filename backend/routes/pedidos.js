const express = require("express");
const router = express.Router();
const pool = require("../db");
const autenticar = require("../middlewares/authMiddleware");

// 📋 Listar todos os pedidos da empresa logada
router.get("/", autenticar, async (req, res) => {
  try {
    const empresaId = req.empresaId;
    const result = await pool.query(
      "SELECT * FROM pedidos WHERE empresa_id = $1 ORDER BY data_pedido DESC",
      [empresaId]
    );

    // Converter JSON dos itens
    const pedidos = result.rows.map((p) => ({
      ...p,
      itens: typeof p.itens === "string" ? JSON.parse(p.itens) : p.itens,
    }));

    res.json(pedidos);
  } catch (err) {
    console.error("❌ Erro ao listar pedidos:", err);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// 🆕 Criar novo pedido
router.post("/", autenticar, async (req, res) => {
  try {
    const empresaId = req.empresaId;
    const { mesa, itens, observacao } = req.body;

    if (!mesa || !itens || itens.length === 0) {
      return res.status(400).json({ error: "Mesa e itens são obrigatórios" });
    }

    const result = await pool.query(
      `INSERT INTO pedidos (mesa, itens, observacao, status, data_pedido, empresa_id)
       VALUES ($1, $2, $3, 'pendente', NOW(), $4)
       RETURNING *`,
      [mesa, JSON.stringify(itens), observacao || "", empresaId]
    );

    res.status(201).json({
      message: "✅ Pedido criado com sucesso!",
      pedido: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Erro ao criar pedido:", err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
});

// 🔄 Atualizar status de pedido
router.patch("/:id", autenticar, async (req, res) => {
  try {
    const empresaId = req.empresaId;
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2 AND empresa_id = $3 RETURNING *",
      [status, id, empresaId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Pedido não encontrado" });

    res.json({ message: "Status atualizado!", pedido: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao atualizar pedido:", err);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// 📦 Listar pedidos concluídos
router.get("/concluidos", autenticar, async (req, res) => {
  try {
    const empresaId = req.empresaId;
    const result = await pool.query(
      "SELECT * FROM pedidos WHERE empresa_id = $1 AND status = 'concluído' ORDER BY data_pedido DESC",
      [empresaId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Erro ao listar pedidos concluídos:", err);
    res.status(500).json({ error: "Erro ao listar pedidos concluídos" });
  }
});

module.exports = router;
