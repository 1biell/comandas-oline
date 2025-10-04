function ListaPedidos({ pedidos }) {
  return (
    <div>
      <h2>📋 Pedidos Registrados</h2>
      {pedidos.length === 0 && <p>Nenhum pedido registrado ainda.</p>}
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            <strong>Mesa {p.mesa}</strong> - {p.status}
            <ul>
              {p.itens.map((i, idx) => (
                <li key={idx}>{i.quantidade}x {i.produto}</li>
              ))}
            </ul>
            {p.observacao && <em>Obs: {p.observacao}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaPedidos;
