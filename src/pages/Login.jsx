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
    <div className="page-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="page-title">Login</h2>
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
        {error && <p className="erro-msg">{error}</p>}
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p style={{ textAlign: "center", marginTop: "12px" }}>
          Não tem conta? <Link to="/register" style={{ color: "#2563eb" }}>Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;