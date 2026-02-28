// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute } from "../constants/permissions";
import "../styles/pages.css";

/**
 * Atalhos de navegação exibidos no Dashboard por perfil.
 * Cada item herda a restrição já definida em ROUTE_PERMISSIONS.
 */
const ATALHOS = [
  {
    path: "/medicoes",
    label: "Nova Medição",
    descricao: "Registrar dimensões e fotos da obra",
  },
  {
    path: "/solicitacoes",
    label: "Solicitar Materiais",
    descricao: "Pedir materiais e recursos para a obra",
  },
  {
    path: "/status-solicitacoes",
    label: "Minhas Solicitações",
    descricao: "Acompanhar o andamento das solicitações",
  },
  {
    path: "/upload",
    label: "Enviar Arquivos",
    descricao: "Enviar documentos, fotos e relatórios",
  },
  // supervisor e admin
  {
    path: "/medicoes-lista",
    label: "Lista de Medições",
    descricao: "Visualizar e aprovar medições enviadas",
  },
  {
    path: "/relatorios",
    label: "Relatórios",
    descricao: "Visualizar relatórios de medições",
  },
  {
    path: "/obras",
    label: "Obras",
    descricao: "Ver e gerenciar as obras cadastradas",
  },
  // admin
  {
    path: "/admin",
    label: "Administração",
    descricao: "Painel de controle do sistema",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const perfil = user?.perfil || null;

  const atalhosVisiveis = ATALHOS.filter(({ path }) => canAccessRoute(perfil, path));

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Página Inicial</h1>
        <p className="page-description">
          Bem-vindo, {user?.nome || "usuário"}. Escolha uma opção abaixo para começar:
        </p>

        <div className="buttons-container">
          {atalhosVisiveis.map(({ path, label, descricao }) => (
            <button
              key={path}
              className="topic-button"
              onClick={() => navigate(path)}
            >
              <span className="topic-button-title">{label}</span>
              <span className="topic-button-desc">{descricao}</span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
