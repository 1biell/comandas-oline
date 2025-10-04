import "./App.css";
import Garcom from "./components/Garcom";
import Cozinha from "./components/Cozinha";
import HistoricoPedidos from "./components/HistoricoPedidos";
import { useState } from "react";

function App() {
  const [tela, setTela] = useState("garcom"); // "garcom", "cozinha" ou "historico"

  return (
    <div>
      <header style={{ textAlign: "center", marginTop: "15px" }}>
        <button onClick={() => setTela("garcom")} className="toggleBtn">Menu do Garçom</button>
        <button onClick={() => setTela("cozinha")} className="toggleBtn">Tela da Cozinha</button>
        <button onClick={() => setTela("historico")} className="toggleBtn">Histórico</button>
      </header>

      {tela === "garcom" && <Garcom />}
      {tela === "cozinha" && <Cozinha />}
      {tela === "historico" && <HistoricoPedidos />}
    </div>
  );
}

export default App;
