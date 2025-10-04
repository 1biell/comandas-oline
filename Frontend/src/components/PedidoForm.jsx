import { useState } from "react";

function PedidoForm({ onAdd }) {
  const [mesa, setMesa] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const novoPedido = {
      mesa: parseInt(mesa),
      itens: [{ produto, quantidade: parseInt(quantidade) }],
      observacao
    };
    onAdd(novoPedido);
    setMesa("");
    setProduto("");
    setQuantidade(1);
    setObservacao("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="number"
        placeholder="Mesa"
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Produto"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Qtd"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Observação"
        value={observacao}
        onChange={(e) => setObservacao(e.target.value)}
      />
      <button type="submit">Adicionar Pedido</button>
    </form>
  );
}

export default PedidoForm;
