import { useState, useEffect } from "react";
import axios from "axios";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
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

  const atualizarStatus = (id, status) => {
    axios.patch(`http://localhost:5000/pedidos/${id}`, { status })
      .then(() => fetchPedidos())
      .catch(err => console.error(err));
  };

  const statusColor = (status) => {
    switch(status) {
      case "pendente": return "#1E90FF";
      case "em preparo": return "#FFA500";
      case "concluído": return "#32CD32";
      default: return "#ffffff";
    }
  };

  // Ordenar pedidos mais recentes primeiro
  const pedidosOrdenados = [...pedidos].sort(
    (a, b) => new Date(b.data_pedido) - new Date(a.data_pedido)
  );

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
    <div style={{ padding: "20px" }}>
      <h1>🍣 Tela da Cozinha</h1>
      {pedidos.length === 0 && <p>Nenhum pedido no momento.</p>}

      <ul style={{ padding: 0 }}>
        {pedidosPaginaAtual.map(p => (
          <li key={p.id} style={{
            background: statusColor(p.status),
            margin: "10px auto",
            padding: "20px",
            borderRadius: "15px",
            maxWidth: "500px",
            listStyle: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            color: "#ffffff",
            opacity: p.status === "concluído" ? 0.9 : 1
          }}>
            <strong>Mesa {p.mesa}</strong> - {p.status} - {formatarData(p.data_pedido)}
            <ul>
              {p.itens.map((i, idx) => (<li key={idx}>{i.quantidade}x {i.produto}</li>))}
            </ul>
            {p.observacao && <em>Obs: {p.observacao}</em>}

            {p.status !== "concluído" && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {p.status === "pendente" && (
                  <button 
                    style={{ padding: "8px 12px", background: "#1E90FF", color: "#F0F2F2", borderRadius: "6px", fontWeight: "600" }}
                    onClick={() => atualizarStatus(p.id, "em preparo")}
                  >
                    Em preparo
                  </button>
                )}
                <button 
                  style={{ padding: "8px 12px", background: "#123859", color: "#F0F2F2", borderRadius: "6px", fontWeight: "600" }}
                  onClick={() => atualizarStatus(p.id, "concluído")}
                >
                  Concluir
                </button>
              </div>
            )}
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

export default Cozinha;
