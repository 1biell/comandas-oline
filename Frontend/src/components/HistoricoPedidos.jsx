import { useEffect, useState } from "react";

export default function HistoricoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const pedidosPorPagina = 3;

  useEffect(() => {
    fetch("http://localhost:5000/pedidos/concluidos")
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error(err));
  }, []);

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

  const indexUltimoPedido = paginaAtual * pedidosPorPagina;
  const indexPrimeiroPedido = indexUltimoPedido - pedidosPorPagina;
  const pedidosPaginaAtual = pedidos.slice(indexPrimeiroPedido, indexUltimoPedido);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const irParaPagina = (numero) => {
    if (numero < 1) numero = 1;
    if (numero > totalPaginas) numero = totalPaginas;
    setPaginaAtual(numero);
  };

  return (
    <div className="historico-container">
      <h2>Histórico de Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>Nenhum pedido concluído</p>
      ) : (
        <>
          {pedidosPaginaAtual.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <p><strong>Mesa:</strong> {pedido.mesa}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`status-${pedido.status.toLowerCase()}`}>{pedido.status}</span>
              </p>
              <p><strong>Itens:</strong></p>
              <ul>
                {pedido.itens.map((item, i) => (
                  <li key={i}>{item.quantidade}x {item.produto}</li>
                ))}
              </ul>
              <p><em>Aberto em: {formatarData(pedido.data_pedido)}</em></p>
            </div>
          ))}

          {/* Paginação */}
          <div className="paginacao">
            <button onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
              &lt; Anterior
            </button>
            <span>Página {paginaAtual} de {totalPaginas}</span>
            <button onClick={() => irParaPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
              Próxima &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
}
