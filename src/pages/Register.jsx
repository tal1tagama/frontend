import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { email, senha });
      alert("Usuário registrado com sucesso!");
      navigate("/");
    } catch (error) {
      alert("Erro ao registrar: " + error.response?.data?.message);
    }
  };

  return (
    <div className="register-container">
      <h1>Registrar</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <button className="button" onClick={handleRegister}>Registrar</button>
    </div>
  );
}

export default Register;
