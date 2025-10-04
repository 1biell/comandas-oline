const pool = require("../models/pedidosModel");

// Criar um novo pedido
exports.criarPedido = async (req, res) => {
  const { mesa, itens, observacao } = req.body;

  if (!mesa || !itens || itens.length === 0) {
    return res.status(400).json({ erro: "Mesa e itens são obrigatórios" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Inserir pedido
    const pedidoResult = await client.query(
      "INSERT INTO pedidos (mesa, status, observacao, data_pedido) VALUES ($1, $2, $3, NOW()) RETURNING id, mesa, status, observacao, data_pedido",
      [mesa, "pendente", observacao || ""]
    );
    const pedidoId = pedidoResult.rows[0].id;

    // Inserir itens do pedido
    const insertItensQuery = `
      INSERT INTO pedido_itens (pedido_id, nome_item, quantidade)
      VALUES ($1, $2, $3)
    `;
    for (const item of itens) {
      await client.query(insertItensQuery, [pedidoId, item.produto, item.quantidade]);
    }

    await client.query("COMMIT");

    res.status(201).json({ mensagem: "Pedido criado com sucesso", pedido: pedidoResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar pedido" });
  } finally {
    client.release();
  }
};

// Listar todos os pedidos com itens (mais recentes primeiro)
exports.listarPedidos = async (req, res) => {
  try {
    // Pegar pedidos ordenados do mais recente para o mais antigo
    const pedidosResult = await pool.query("SELECT * FROM pedidos ORDER BY data_pedido DESC, id DESC");
    const pedidos = pedidosResult.rows;

    // Pegar itens de todos os pedidos
    const pedidoIds = pedidos.map(p => p.id);
    let itens = [];
    if (pedidoIds.length > 0) {
      const itensResult = await pool.query(
        `SELECT * FROM pedido_itens WHERE pedido_id = ANY($1::int[])`,
        [pedidoIds]
      );
      itens = itensResult.rows;
    }

    // Mapear itens para cada pedido
    const pedidosComItens = pedidos.map(p => ({
      ...p,
      itens: itens
        .filter(i => i.pedido_id === p.id)
        .map(i => ({ produto: i.nome_item, quantidade: i.quantidade }))
    }));

    res.json(pedidosComItens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pedidos" });
  }
};

// Listar apenas pedidos concluídos (Histórico)
exports.listarPedidosConcluidos = async (req, res) => {
  try {
    const pedidosResult = await pool.query(
      "SELECT * FROM pedidos WHERE status = 'concluído' ORDER BY data_pedido DESC, id DESC"
    );
    const pedidos = pedidosResult.rows;

    const pedidoIds = pedidos.map(p => p.id);
    let itens = [];
    if (pedidoIds.length > 0) {
      const itensResult = await pool.query(
        `SELECT * FROM pedido_itens WHERE pedido_id = ANY($1::int[])`,
        [pedidoIds]
      );
      itens = itensResult.rows;
    }

    const pedidosComItens = pedidos.map(p => ({
      ...p,
      itens: itens
        .filter(i => i.pedido_id === p.id)
        .map(i => ({ produto: i.nome_item, quantidade: i.quantidade }))
    }));

    res.json(pedidosComItens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pedidos concluídos" });
  }
};

// Atualizar status do pedido
exports.atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ erro: "Status é obrigatório" });
  }

  try {
    const result = await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json({ mensagem: "Status atualizado", pedido: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar status" });
  }
};
