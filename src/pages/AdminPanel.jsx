// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";
import { listPurchases } from "../services/purchasesService";
import { listAllMedicoes } from "../services/medicoesService";
import { listObras } from "../services/obrasService";
import "../styles/pages.css";

/**
 * Painel de Administração — acesso exclusivo do perfil Admin.
 *
 * Exibe estatísticas do sistema consumindo endpoints já disponíveis:
 *  - GET /api/obras            → total de obras
 *  - GET /api/measurements     → total de medições
 *  - GET /api/solicitacoes     → total e pendentes
 *  - GET /api/files/storage/usage → uso de armazenamento
 */
function AdminPanel() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalObras: null,
    totalMedicoes: null,
    medicoespendentes: null,
    totalSolicitacoes: null,
    solicitacoesPendentes: null,
    storageUsed: null,
    storageUnit: null,
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setErro(null);

        // Paraleliza as chamadas independentes
        const [obrasRes, medicoeRes, solicitacoesRes, storageRes] = await Promise.allSettled([
          listObras({ page: 1, limit: 100 }),
          listAllMedicoes({ page: 1, limit: 100 }),
          listPurchases(),
          api.get("/files/storage/usage"),
        ]);

        const obras = obrasRes.status === "fulfilled"
          ? (Array.isArray(obrasRes.value) ? obrasRes.value : [])
          : [];

        const medicoes = medicoeRes.status === "fulfilled"
          ? (Array.isArray(medicoeRes.value) ? medicoeRes.value : medicoeRes.value?.data || [])
          : [];

        const solicitacoes = solicitacoesRes.status === "fulfilled"
          ? (Array.isArray(solicitacoesRes.value) ? solicitacoesRes.value : solicitacoesRes.value?.data || [])
          : [];

        // Storage pode retornar em bytes, KB, MB etc.
        const storageData = storageRes.status === "fulfilled"
          ? storageRes.value?.data?.data || storageRes.value?.data || null
          : null;

        const formatStorage = (storageData) => {
          if (!storageData) return { value: null, unit: null };
          const bytes = storageData.totalBytes || storageData.used || storageData.totalSize || 0;
          if (bytes === 0) return { value: "0", unit: "MB" };
          if (bytes >= 1073741824) return { value: (bytes / 1073741824).toFixed(1), unit: "GB" };
          if (bytes >= 1048576) return { value: (bytes / 1048576).toFixed(1), unit: "MB" };
          return { value: (bytes / 1024).toFixed(0), unit: "KB" };
        };

        const { value: storageUsed, unit: storageUnit } = formatStorage(storageData);

        const medicoesList = Array.isArray(medicoes) ? medicoes : [];
        const solicitacoesList = Array.isArray(solicitacoes) ? solicitacoes : [];

        setStats({
          totalObras: obras.length,
          totalMedicoes: medicoesList.length,
          medicoesPendentes: medicoesList.filter(m => (m.status || "enviada") === "enviada" || m.status === "pendente").length,
          totalSolicitacoes: solicitacoesList.length,
          solicitacoesPendentes: solicitacoesList.filter(s => s.status === "pendente").length,
          storageUsed,
          storageUnit,
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
                sub={`${stats.medicoesPendentes ?? "—"} aguardando aprovação`}
                destaque={stats.medicoesPendentes > 0}
              />
              <StatCard
                label="Total de solicitações"
                value={stats.totalSolicitacoes}
                sub={`${stats.solicitacoesPendentes ?? "—"} pendentes de aprovação`}
                destaque={stats.solicitacoesPendentes > 0}
              />
              {stats.storageUsed !== null && (
                <StatCard
                  label="Armazenamento utilizado"
                  value={`${stats.storageUsed} ${stats.storageUnit}`}
                  sub="espaço em disco utilizado pelos arquivos"
                />
              )}
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
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default AdminPanel;
