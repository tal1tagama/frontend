// src/pages/Login.jsx
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      login(res.data); // salva user + token
      navigate("/"); // redireciona imediatamente
    } catch (err) {
      setError(extractApiMessage(err, "Email ou senha invalidos."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <h2 className="page-title">Bem-vindo</h2>
          <p className="login-subtitle">Digite suas credenciais para acessar o sistema</p>
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

        <p className="login-footer">
          Não tem uma conta? <Link to="/register">Cadastre-se gratuitamente</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;