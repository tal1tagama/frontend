// src/pages/Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="buttons-container">
        <button onClick={() => navigate("/medicoes")}>
          Enviar Medição
        </button>
        <button onClick={() => navigate("/solicitacoes")}>
          Solicitação
        </button>
        <button onClick={() => navigate("/relatorios")}>
          Relatórios
        </button>
      </div>
    </div>
  );
};

export default Dashboard;