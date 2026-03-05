// src/pages/Register.jsx
// Tela de cadastro de funcionário — acessível apenas pelo perfil ADMIN
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { extractApiMessage } from "../services/response";
import { validarSenha } from "../utils/validarSenha";
import { PERFIL_LABELS } from "../constants/permissions";
import "../styles/pages.css";

const Register = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("encarregado");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroSenha = validarSenha(senha);
    if (erroSenha) {
      setError(erroSenha);
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await api.post("/auth/register", { nome, email, senha, perfil });
      setSuccess(`Funcionário "${nome}" cadastrado com sucesso como ${PERFIL_LABELS[perfil] || perfil}.`);
      // Limpar formulário para novo cadastro
      setNome("");
      setEmail("");
      setSenha("");
      setPerfil("encarregado");
    } catch (err) {
      setError("Erro ao cadastrar funcionário: " + extractApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "520px" }}>
        <h1 className="page-title">Cadastrar Funcionário</h1>
        <p className="page-description">
          Preencha os dados abaixo para cadastrar um novo funcionário no sistema.
          Apenas administradores podem realizar esta ação.
        </p>

        {error && <p className="erro-msg">{error}</p>}
        {success && (
          <p
            style={{
              color: "var(--cor-sucesso, #2e7d32)",
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: "6px",
              padding: "10px 14px",
              marginBottom: "1rem",
            }}
          >
            ✔ {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Nome completo do funcionário"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha Inicial</label>
            <input
              id="senha"
              type="password"
              placeholder="Mínimo 8 caracteres, 1 maiúscula e 1 número"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
            <small
              style={{
                display: "block",
                marginTop: "4px",
                color: "var(--cor-texto-secundario)",
                fontSize: "14px",
              }}
            >
              Mínimo 8 caracteres, ao menos uma letra maiúscula e um número.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="perfil">Perfil de Acesso</label>
            <select
              id="perfil"
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid var(--cor-borda, #ccc)",
                fontSize: "1rem",
                background: "#fff",
              }}
            >
              <option value="encarregado">Encarregado</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              className="button-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => navigate("/admin")}
              style={{ flex: 1 }}
            >
              Voltar ao Painel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Register;