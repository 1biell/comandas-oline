import { useState, useEffect } from "react";
import axios from "axios";

function Garcom() {
  const [pedidos, setPedidos] = useState([]);
  const [mesa, setMesa] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [itens, setItens] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const pedidosPorPagina = 5;

  const fetchPedidos = () => {
    axios.get("http://localhost:5000/pedidos")
      .then(res => setPedidos(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const adicionarItem = () => {
    if (!produto || quantidade <= 0) return;
    setItens([...itens, { produto, quantidade: parseInt(quantidade) }]);
    setProduto("");
    setQuantidade(1);
  };

  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mesa || itens.length === 0) return;

    const novoPedido = { mesa: parseInt(mesa), itens, observacao };
    axios.post("http://localhost:5000/pedidos", novoPedido)
      .then(() => {
        fetchPedidos();
        setMesa(""); setObservacao(""); setItens([]);
      })
      .catch(err => console.error(err));
  };

  // Ordenar pedidos mais recentes primeiro
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.data_pedido) - new Date(a.data_pedido)
  );

  // Paginação
  const indexUltimoPedido = paginaAtual * pedidosPorPagina;
  const indexPrimeiroPedido = indexUltimoPedido - pedidosPorPagina;
  const pedidosPaginaAtual = pedidosOrdenados.slice(indexPrimeiroPedido, indexUltimoPedido);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const irParaPagina = (numero) => {
    if (numero < 1) numero = 1;
    if (numero > totalPaginas) numero = totalPaginas;
    setPaginaAtual(numero);
  };

  // Função para ajustar horário UTC para São Paulo
  const formatarData = (data) => {
    const d = new Date(data);
    d.setHours(d.getHours() - 0);  // Ajustar aqui conforme necessario
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <h1>🍣 Menu do Garçom</h1>
      <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Mesa" value={mesa} onChange={e => setMesa(e.target.value)} required />
        <input type="text" placeholder="Produto" value={produto} onChange={e => setProduto(e.target.value)} />
        <input type="number" placeholder="Qtd" value={quantidade} onChange={e => setQuantidade(e.target.value)} />
        <button type="button" onClick={adicionarItem}>Adicionar Item</button>
        <button type="submit">Enviar Pedido</button>
      </form>

      {itens.length > 0 && (
        <div style={{ maxWidth: "500px", margin: "0 auto 20px", background: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <h3>Itens do Pedido</h3>
          <ul>
            {itens.map((i, idx) => (
              <li key={idx}>
                {i.quantidade}x {i.produto} 
                <button style={{ marginLeft: "10px", background: "#ff4d4d", color: "#fff", borderRadius: "6px", padding: "2px 6px" }}
                  onClick={() => removerItem(idx)}>X</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>📋 Pedidos Registrados</h2>
      <ul>
        {pedidosPaginaAtual.map(p => (
          <li key={p.id} style={{ opacity: p.status === "concluído" ? 0.6 : 1 }}>
            <strong>Mesa {p.mesa}</strong> - {p.status} - {formatarData(p.data_pedido)}
            <ul>
              {p.itens.map((i, idx) => (<li key={idx}>{i.quantidade}x {i.produto}</li>))}
            </ul>
            {p.observacao && <em>Obs: {p.observacao}</em>}
          </li>
        ))}
      </ul>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>&lt; Anterior</button>
          <span>Página {paginaAtual} de {totalPaginas}</span>
          <button onClick={() => irParaPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próxima &gt;</button>
        </div>
      )}
    </div>
  );
}

export default Garcom;
