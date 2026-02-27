// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { canAccessRoute } from "../constants/permissions";
import "../styles/pages.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const perfil = (JSON.parse(localStorage.getItem("user") || "null") || {}).perfil;

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Página Inicial</h1>
        <p style={{ fontSize: "var(--tamanho-fonte-grande)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-xl)", lineHeight: "1.6" }}>
          Bem-vindo ao sistema de gestão de obras. Escolha uma opção abaixo para começar:
        </p>
        <div className="buttons-container">
          {canAccessRoute(perfil, "/medicoes") && (
            <button className="topic-button" onClick={() => navigate("/medicoes")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>📏</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Enviar Medição</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Registrar novas medidas da obra</small>
            </button>
          )}
          {canAccessRoute(perfil, "/medicoes-lista") && (
            <button className="topic-button" onClick={() => navigate("/medicoes-lista")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>📋</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Lista de Medições</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Visualizar medições registradas</small>
            </button>
          )}
          {canAccessRoute(perfil, "/solicitacoes") && (
            <button className="topic-button" onClick={() => navigate("/solicitacoes")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>🛒</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Nova Solicitação</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Solicitar materiais e recursos</small>
            </button>
          )}
          {canAccessRoute(perfil, "/status-solicitacoes") && (
            <button className="topic-button" onClick={() => navigate("/status-solicitacoes")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>⏳</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Status de Solicitações</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Acompanhar solicitações enviadas</small>
            </button>
          )}
          {canAccessRoute(perfil, "/upload") && (
            <button className="topic-button" onClick={() => navigate("/upload")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>📤</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Enviar Arquivos</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Upload de documentos e fotos</small>
            </button>
          )}
          {canAccessRoute(perfil, "/relatorios") && (
            <button className="topic-button" onClick={() => navigate("/relatorios")}>
              <span style={{ fontSize: "24px", marginRight: "8px" }}>📊</span>
              <span style={{ display: "block", fontWeight: 600, fontSize: "18px" }}>Meus Relatórios</span>
              <small style={{ display: "block", marginTop: "4px", fontWeight: 400, opacity: 0.8 }}>Visualizar relatórios gerados</small>
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;