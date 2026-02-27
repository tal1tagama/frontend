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
        <h1 className="page-title">Dashboard</h1>
        <div className="buttons-container">
          {canAccessRoute(perfil, "/medicoes") && (
            <button className="topic-button" onClick={() => navigate("/medicoes")}>
              Enviar Medição
            </button>
          )}
          {canAccessRoute(perfil, "/medicoes-lista") && (
            <button className="topic-button" onClick={() => navigate("/medicoes-lista")}>
              Lista de Medicoes
            </button>
          )}
          {canAccessRoute(perfil, "/solicitacoes") && (
            <button className="topic-button" onClick={() => navigate("/solicitacoes")}>
              Solicitação
            </button>
          )}
          {canAccessRoute(perfil, "/status-solicitacoes") && (
            <button className="topic-button" onClick={() => navigate("/status-solicitacoes")}>
              Status de Solicitacoes
            </button>
          )}
          {canAccessRoute(perfil, "/upload") && (
            <button className="topic-button" onClick={() => navigate("/upload")}>
              Upload de Arquivos
            </button>
          )}
          {canAccessRoute(perfil, "/relatorios") && (
            <button className="topic-button" onClick={() => navigate("/relatorios")}>
              Relatórios
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;