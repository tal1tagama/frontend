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
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="erro-msg">{error}</p>}
        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
        <p style={{ textAlign: "center", marginTop: "12px" }}>
          Já tem conta?{" "}
          <Link to="/login" style={{ color: "#2563eb" }}>
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;