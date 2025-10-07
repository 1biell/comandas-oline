import "./styles/App.css";
import Garcom from "./components/Garcom";
import Cozinha from "./components/Cozinha";
import HistoricoPedidos from "./components/HistoricoPedidos";
import LoginEmpresa from "./components/LoginEmpresa";
import RegisterEmpresa from "./components/RegisterEmpresa";
import { useState } from "react";

function App() {
  const [tela, setTela] = useState("login"); // login, register, garcom, cozinha, historico
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTela("login");
  };

  // 🔹 Tela de Login
  if (!token && tela === "login") {
    return (
      <LoginEmpresa
        onLoginSuccess={() => setTela("garcom")}
        onRegisterClick={() => setTela("register")}
      />
    );
  }

  // 🔹 Tela de Cadastro
  if (!token && tela === "register") {
    return <RegisterEmpresa onRegisterComplete={() => setTela("login")} />;
  }

  // 🔹 Telas internas (após login)
  return (
    <div>
      <header style={{ textAlign: "center", marginTop: "15px" }}>
        <button onClick={() => setTela("garcom")} className="toggleBtn">
          Menu do Garçom
        </button>
        <button onClick={() => setTela("cozinha")} className="toggleBtn">
          Tela da Cozinha
        </button>
        <button onClick={() => setTela("historico")} className="toggleBtn">
          Histórico
        </button>
        <button onClick={handleLogout} className="toggleBtn">
          Sair
        </button>
      </header>

      {tela === "garcom" && <Garcom />}
      {tela === "cozinha" && <Cozinha />}
      {tela === "historico" && <HistoricoPedidos />}
    </div>
  );
}

export default App;
