import React, { useState } from "react";

function Register() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cnpj: ""
  });
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("✅ Empresa cadastrada com sucesso!");
      } else {
        setMensagem(`❌ ${data.error || "Erro no cadastro"}`);
      }
    } catch (err) {
      setMensagem("❌ Erro de conexão com o servidor");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cadastro de Empresa</h2>
      <form onSubmit={handleRegister}>
        <input name="nome" placeholder="Nome" onChange={handleChange} required /><br />
        <input name="email" placeholder="E-mail" onChange={handleChange} required /><br />
        <input name="senha" type="password" placeholder="Senha" onChange={handleChange} required /><br />
        <input name="telefone" placeholder="Telefone" onChange={handleChange} /><br />
        <input name="cnpj" placeholder="CNPJ" onChange={handleChange} /><br />
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Register;
