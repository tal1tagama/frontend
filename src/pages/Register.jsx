// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/pages.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, senha, nome });
      alert("Usuário criado com sucesso!");
      navigate("/login");
    } catch (err) {
      alert("Erro ao criar usuário: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="page-title">Cadastro</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" className="button-primary">Cadastrar</button>
        <p style={{ textAlign: "center", marginTop: "12px" }}>
          Já tem conta? <Link to="/login" style={{ color: "#2563eb" }}>Entrar</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;