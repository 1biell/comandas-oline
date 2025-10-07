import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMensagem("✅ Login realizado com sucesso!");
      } else {
        setMensagem(`❌ ${data.error || "Falha no login"}`);
      }
    } catch (err) {
      setMensagem("❌ Erro de conexão com o servidor");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login da Empresa</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        /><br />
        <button type="submit">Entrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Login;
