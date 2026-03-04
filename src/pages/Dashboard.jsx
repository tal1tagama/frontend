// src/pages/Dashboard.jsx
// Página inicial do sistema, exibida após o login.
// Os atalhos visíveis dependem do perfil do usuário (encarregado / supervisor / admin).
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute } from "../constants/permissions";
import "../styles/pages.css";

/**
 * Atalhos de navegação agrupados por categoria.
 * A visibilidade de cada atalho é controlada por ROUTE_PERMISSIONS.
 */
const GRUPOS = [
  {
    titulo: "Atividades do Dia a Dia",
    atalhos: [
      {
        path: "/medicoes",
        label: "Nova Medição",
        descricao: "Registrar dimensões e informações da obra",
        icone: "\uD83D\uDCCF",
      },
      {
        path: "/upload",
        label: "Enviar Arquivos",
        descricao: "Enviar documentos, fotos e relatórios",
        icone: "\uD83D\uDCC1",
      },
      {
        path: "/solicitacoes",
        label: "Solicitar Materiais",
        descricao: "Pedir materiais e recursos para a obra",
        icone: "\uD83D\uDECD️",
      },
      {
        path: "/status-solicitacoes",
        label: "Minhas Solicitações",
        descricao: "Acompanhar o andamento das solicitações",
        icone: "\uD83D\uDCCB",
      },
    ],
  },
  {
    titulo: "Gestão e Aprovação",
    atalhos: [
      {
        path: "/medicoes-lista",
        label: "Lista de Medições",
        descricao: "Visualizar e aprovar medições enviadas",
        icone: "\u2705",
      },
      {
        path: "/relatorios",
        label: "Relatórios",
        descricao: "Visualizar relatórios de medições e obras",
        icone: "\uD83D\uDCCA",
      },
      {
        path: "/obras",
        label: "Obras",
        descricao: "Ver e gerenciar as obras cadastradas",
        icone: "\uD83C\uDFD7️",
      },
    ],
  },
  {
    titulo: "Administração do Sistema",
    atalhos: [
      {
        path: "/admin",
        label: "Painel Administrativo",
        descricao: "Painel de controle do sistema",
        icone: "\u2699️",
      },
      {
        path: "/register",
        label: "Cadastrar Funcionário",
        descricao: "Adicionar novos usuários ao sistema",
        icone: "\uD83D\uDC64",
      },
    ],
  },
];

const PERFIL_LABEL = {
  admin: "Administrador",
  supervisor: "Supervisor",
  encarregado: "Encarregado",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const perfil = user?.perfil || null;

  // Filtra apenas os atalhos que o perfil atual pode acessar
  const gruposVisiveis = GRUPOS.map((grupo) => ({
    ...grupo,
    atalhos: grupo.atalhos.filter(({ path }) => canAccessRoute(perfil, path)),
  })).filter((grupo) => grupo.atalhos.length > 0);

  return (
    <Layout>
      <div className="page-container">
        {/* ─── Cabeçalho de boas-vindas ──────────────────────────────── */}
        <div
          style={{
            background: "var(--cor-primaria-clara)",
            border: "2px solid var(--cor-primaria)",
            borderRadius: "var(--borda-radius-grande)",
            padding: "var(--espacamento-lg) var(--espacamento-xl)",
            marginBottom: "var(--espacamento-xl)",
          }}
        >
          <h1 className="page-title" style={{ borderBottom: "none", marginBottom: "4px" }}>
            Olá, {user?.nome || "usuário"}!
          </h1>
          <p style={{ margin: 0, color: "var(--cor-texto-secundario)", fontSize: "var(--tamanho-fonte-base)" }}>
            Perfil: <strong>{PERFIL_LABEL[perfil] || perfil}</strong>&nbsp;&bull;&nbsp;
            Escolha uma opção abaixo para começar.
          </p>
        </div>

        {/* ─── Grupos de atalhos ───────────────────────────────────────── */}
        {gruposVisiveis.map((grupo) => (
          <div key={grupo.titulo} style={{ marginBottom: "var(--espacamento-xl)" }}>
            <h2
              style={{
                fontSize: "var(--tamanho-subtitulo)",
                fontWeight: 700,
                color: "var(--cor-texto-principal)",
                marginBottom: "var(--espacamento-md)",
                paddingBottom: "var(--espacamento-xs)",
                borderBottom: "2px solid var(--cor-borda)",
              }}
            >
              {grupo.titulo}
            </h2>

            {/* Grade responsiva: 2 colunas em telas largas, 1 em telas pequenas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--espacamento-md)",
              }}
            >
              {grupo.atalhos.map(({ path, label, descricao, icone }) => (
                <button
                  key={path}
                  className="topic-button"
                  onClick={() => navigate(path)}
                  style={{ marginBottom: 0 }}
                >
                  <span style={{ fontSize: "28px", marginBottom: "var(--espacamento-xs)", display: "block" }}>
                    {icone}
                  </span>
                  <span className="topic-button-title">{label}</span>
                  <span className="topic-button-desc">{descricao}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
