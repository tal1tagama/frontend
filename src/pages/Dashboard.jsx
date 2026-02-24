// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/pages.css";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="buttons-container">
          <button className="topic-button" onClick={() => navigate("/medicoes")}>
            Enviar Medição
          </button>
          <button className="topic-button" onClick={() => navigate("/solicitacoes")}>
            Solicitação
          </button>
          <button className="topic-button" onClick={() => navigate("/relatorios")}>
            Relatórios
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;