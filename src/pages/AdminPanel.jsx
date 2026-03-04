// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/pages.css";

/**
 * Painel de Administração — acesso exclusivo do perfil Admin.
 *
 * Estatísticas obtidas via GET /api/stats que usa COUNT SQL real,
 * evitando o bug anterior de limitar a 100 registros e contar localmente.
 */
function AdminPanel() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalObras: null,
    totalMedicoes: null,
    medicoesPendentes: null,
    medicoesAprovadas: null,
    totalSolicitacoes: null,
    solicitacoesPendentes: null,
    totalArquivos: null,
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setErro(null);

        // Endpoint dedicado com COUNT SQL real — sem limite artificial
        const res = await api.get("/stats");
        const data = res.data?.data || {};

        setStats({
          totalObras:            data.totalObras            ?? null,
          totalMedicoes:         data.totalMedicoes         ?? null,
          medicoesPendentes:     data.medicoesPendentes     ?? null,
          medicoesAprovadas:     data.medicoesAprovadas     ?? null,
          totalSolicitacoes:     data.totalSolicitacoes     ?? null,
          solicitacoesPendentes: data.solicitacoesPendentes ?? null,
          totalArquivos:         data.totalArquivos         ?? null,
        });
      } catch (err) {
        console.error("Erro ao carregar stats:", err);
        setErro("Não foi possível carregar as estatísticas do sistema.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({ label, value, sub, destaque }) => (
    <div className="admin-stat-card">
      <p className="admin-stat-label">{label}</p>
      <p className="admin-stat-value" style={destaque ? { color: "var(--cor-perigo)" } : {}}>
        {value !== null && value !== undefined ? value : "—"}
      </p>
      {sub && <p className="admin-stat-sub">{sub}</p>}
    </div>
  );

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "1000px" }}>
        <h1 className="page-title">Painel de Administração</h1>
        <p className="page-description">
          Visão geral do sistema. Acompanhe os principais indicadores e gerencie os recursos.
        </p>

        {erro && <p className="erro-msg">{erro}</p>}

        {loading && (
          <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            Carregando estatísticas...
          </p>
        )}

        {!loading && (
          <>
            {/* Estatísticas */}
            <div className="admin-grid">
              <StatCard
                label="Total de obras"
                value={stats.totalObras}
                sub="obras cadastradas no sistema"
              />
              <StatCard
                label="Total de medições"
                value={stats.totalMedicoes}
                sub={`${stats.medicoesPendentes ?? "—"} aguardando aprovação · ${stats.medicoesAprovadas ?? "—"} aprovadas`}
                destaque={stats.medicoesPendentes > 0}
              />
              <StatCard
                label="Total de solicitações"
                value={stats.totalSolicitacoes}
                sub={`${stats.solicitacoesPendentes ?? "—"} pendentes de aprovação`}
                destaque={stats.solicitacoesPendentes > 0}
              />
              <StatCard
                label="Total de arquivos"
                value={stats.totalArquivos}
                sub="documentos e fotos enviados"
              />
            </div>

            {/* Ações rápidas */}
            <hr className="section-divider" />
            <h2 className="section-title">Ações Rápidas</h2>

            <div className="buttons-container">
              <button className="topic-button" onClick={() => navigate("/obras")}>
                <span className="topic-button-title">Gerenciar Obras</span>
                <span className="topic-button-desc">Ver todas as obras cadastradas</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/medicoes-lista")}>
                <span className="topic-button-title">Aprovar Medições</span>
                <span className="topic-button-desc">Revisar e aprovar medições pendentes</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/status-solicitacoes")}>
                <span className="topic-button-title">Aprovar Solicitações</span>
                <span className="topic-button-desc">Revisar e aprovar solicitações de materiais</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/relatorios")}>
                <span className="topic-button-title">Relatórios</span>
                <span className="topic-button-desc">Ver relatórios de medições</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/register")}>
                <span className="topic-button-title">Cadastrar Funcionário</span>
                <span className="topic-button-desc">Adicionar novo encarregado ou supervisor</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default AdminPanel;
