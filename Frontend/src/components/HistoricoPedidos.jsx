import { useEffect, useState } from "react";
import "../styles/HistoricoPedidos.css";

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const pedidosPorPagina = 3;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/pedidos/concluidos", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Erro ao buscar pedidos:", err));
  }, []);

  const formatarData = (data) => {
    const d = new Date(data);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Paginação
  const indexUltimo = paginaAtual * pedidosPorPagina;
  const indexPrimeiro = indexUltimo - pedidosPorPagina;
  const pedidosPaginaAtual = pedidos.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const irParaPagina = (n) => {
    if (n < 1 || n > totalPaginas) return;
    setPaginaAtual(n);
  };

  return (
    <div className="historico-container">
      <h2>📜 Histórico de Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>Nenhum pedido concluído</p>
      ) : (
        <>
          {pedidosPaginaAtual.map((pedido) => (
            <div key={pedido.id} className="pedido-card">
              <p>
                <strong>Mesa:</strong> {pedido.mesa}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${pedido.status?.toLowerCase()}`}>
                  {pedido.status}
                </span>
              </p>
              <p>
                <strong>Itens:</strong>
              </p>
              <ul>
                {pedido.itens?.map((item, i) => (
                  <li key={i}>
                    {item.quantidade}x {item.produto}
                  </li>
                ))}
              </ul>
              <p>
                <em>Finalizado em: {formatarData(pedido.data_pedido)}</em>
              </p>
            </div>
          ))}

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="paginacao">
              <button
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
              >
                ⬅️ Anterior
              </button>
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
