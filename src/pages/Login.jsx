// src/pages/Login.jsx
// Tela de login — acesso público.
// O cadastro de novos funcionários é feito EXCLUSIVAMENTE pelo administrador
// (rota /register protegida). Não há cadastro livre nesta tela.
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { email, senha });
      login(res.data); // salva user + token no contexto e localStorage
      navigate("/");   // redireciona para a tela inicial
    } catch (err) {
      setError(extractApiMessage(err, "E-mail ou senha inválidos."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        {/* ── Identidade visual da empresa ── */}
        <div className="login-header">
          <div style={{
            fontSize: "52px",
            lineHeight: 1,
            marginBottom: "var(--espacamento-sm)",
          }}>
            🏗️
          </div>
          <h2 className="page-title">Gestão de Obras</h2>
          <p className="login-subtitle">
            Acesse sua conta para registrar medições, materiais e documentos
          </p>
        </div>

        {error && <p className="erro-msg">{error}</p>}

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
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no Sistema"}
        </button>

        {/* Nota informativa: não há cadastro livre — apenas admins criam contas */}
        <p
          style={{
            marginTop: "var(--espacamento-lg)",
            textAlign: "center",
            fontSize: "var(--tamanho-fonte-pequena)",
            color: "var(--cor-texto-secundario)",
          }}
        >
          Não possui acesso? Solicite o cadastro ao administrador do sistema.
        </p>
      </form>
    </div>
  );
};

export default Login;