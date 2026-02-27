// src/pages/Register.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/register", { email, senha, nome });
      // Aproveita os tokens retornados pelo back — auto-login sem segundo round-trip
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Erro ao criar usuario: " + extractApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <h2 className="page-title">Criar Nova Conta</h2>
          <p className="login-subtitle">Preencha os dados abaixo para começar</p>
        </div>

        {error && <p className="erro-msg">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={6}
            required
            autoComplete="new-password"
          />
          <small style={{ display: "block", marginTop: "4px", color: "var(--cor-texto-secundario)", fontSize: "14px" }}>
            Use uma senha com pelo menos 6 caracteres
          </small>
        </div>

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Criando conta..." : "Criar Minha Conta"}
        </button>

        <p className="login-footer">
          Já tem uma conta? <Link to="/login">Faça login aqui</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;