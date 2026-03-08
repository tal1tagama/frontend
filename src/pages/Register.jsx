// src/pages/Register.jsx
// Tela de cadastro de funcionário — acessível apenas pelo perfil ADMIN
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { IconPersonAdd } from "../components/Icons";
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
      <div className="page-container" style={{ maxWidth: "600px" }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "12px", 
          marginBottom: "var(--espacamento-md)" 
        }}>
          <div style={{ 
            background: "var(--cor-primaria)", 
            color: "white", 
            borderRadius: "12px", 
            padding: "12px", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--sombra-pequena)"
          }}>
            <IconPersonAdd size={28} />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: "4px", border: "none", paddingBottom: 0 }}>
              Cadastrar Funcionário
            </h1>
            <p style={{ 
              color: "var(--cor-texto-secundario)", 
              fontSize: "0.95rem", 
              margin: 0 
            }}>
              Adicione um novo membro à equipe
            </p>
          </div>
        </div>

        <div className="form-container" style={{ 
          background: "white", 
          padding: "var(--espacamento-xl)", 
          borderRadius: "var(--borda-radius-grande)",
          boxShadow: "var(--sombra-media)",
          border: "1px solid var(--cor-borda)"
        }}>
          <p className="page-description" style={{ 
            marginTop: 0, 
            marginBottom: "var(--espacamento-lg)",
            fontSize: "0.95rem",
            lineHeight: "1.6"
          }}>
            Preencha os dados abaixo para cadastrar um novo funcionário no sistema.
            Apenas administradores podem realizar esta ação.
          </p>

          {error && <p className="erro-msg">{error}</p>}
          {success && (
            <p className="success-msg">
              ✔ {success}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Nome Completo
              </label>
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
              <label htmlFor="email">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
                E-mail
              </label>
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
              <label htmlFor="senha">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Senha Inicial
              </label>
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
              <small style={{
                display: "block",
                marginTop: "6px",
                color: "var(--cor-texto-secundario)",
                fontSize: "0.875rem",
                lineHeight: "1.4"
              }}>
                Mínimo 8 caracteres, ao menos uma letra maiúscula e um número.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="perfil">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ display: "inline-block", verticalAlign: "middle", marginRight: "6px" }}
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Perfil de Acesso
              </label>
              <select
                id="perfil"
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                required
              >
                <option value="encarregado">Encarregado</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>

            <div style={{ 
              display: "flex", 
              gap: "12px", 
              marginTop: "var(--espacamento-xl)",
              flexWrap: "wrap"
            }}>
              <button
                type="submit"
                className="button-primary"
                disabled={loading}
                style={{ 
                  flex: 1, 
                  minWidth: "200px",
                  margin: 0,
                  padding: "16px 28px"
                }}
              >
                {loading ? "Cadastrando..." : "Cadastrar Funcionário"}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => navigate("/admin")}
                disabled={loading}
                style={{ 
                  flex: 1, 
                  minWidth: "150px",
                  padding: "16px 28px"
                }}
              >
                Voltar ao Painel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Register;