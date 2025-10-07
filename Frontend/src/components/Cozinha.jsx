import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Cozinha.css";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const pedidosPorPagina = 5; // 🔹 Limite de pedidos por página

  const token = localStorage.getItem("token");

  const fetchPedidos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(res.data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  const atualizarStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/pedidos/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPedidos();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const getClassByStatus = (status) => {
    switch (status) {
      case "pendente":
        return "status-pendente";
      case "em preparo":
        return "status-em-preparo";
      case "concluído":
        return "status-concluido";
      default:
        return "";
    }
  };

  const getButtonByStatus = (pedido) => {
    if (pedido.status === "pendente") {
      return (
        <button
          className="btn-status em-preparo"
          onClick={() => atualizarStatus(pedido.id, "em preparo")}
        >
          Iniciar preparo 🍳
        </button>
      );
    }
    if (pedido.status === "em preparo") {
      return (
        <button
          className="btn-status concluir"
          onClick={() => atualizarStatus(pedido.id, "concluído")}
        >
          Concluir ✅
        </button>
      );
    }
    return null;
  };

  // 🔹 Paginação lógica
  const indexUltimo = paginaAtual * pedidosPorPagina;
  const indexPrimeiro = indexUltimo - pedidosPorPagina;
  const pedidosPaginaAtual = pedidos.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);

  const irParaPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaAtual(num);
  };

  return (
    <div className="cozinha-container">
      <h1>👨‍🍳 Painel da Cozinha</h1>

      {pedidosPaginaAtual.length === 0 ? (
        <p>Nenhum pedido no momento 🍣</p>
      ) : (
        <div className="cozinha-pedidos">
          {pedidosPaginaAtual.map((pedido) => (
            <div
              key={pedido.id}
              className={`cozinha-pedido ${getClassByStatus(pedido.status)}`}
            >
              <h3>Mesa {pedido.mesa}</h3>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getClassByStatus(pedido.status)}>
                  {pedido.status}
                </span>
              </p>
              <ul>
                {pedido.itens.map((item, idx) => (
                  <li key={idx}>
                    {item.quantidade}x {item.produto}
                  </li>
                ))}
              </ul>
              {pedido.observacao && (
                <p className="observacao">📝 {pedido.observacao}</p>
              )}
              {getButtonByStatus(pedido)}
            </div>
          ))}
        </div>
      )}

      {/* 🔸 Paginação */}
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
    </div>
  );
}

export default Cozinha;
