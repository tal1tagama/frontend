// src/pages/Login.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../styles/pages.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, senha });
      login(res.data); // salva user + token
      navigate("/"); // redireciona imediatamente
    } catch (err) {
      alert("Email ou senha inválidos!");
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
        <button type="submit" className="button-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;