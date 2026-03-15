// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Icon from "../components/Icons";
import api from "../services/api";
import {
  getManagementOverview,
  downloadManagementCsv,
  downloadMedicoesCsv,
  downloadBoletimPdf,
} from "../services/managementService";
import "../styles/pages.css";

/**
 * Painel de Administração — acesso exclusivo do perfil Admin.
 *
 * Estatísticas obtidas via GET /api/stats que usa COUNT SQL real,
 * evitando o bug anterior de limitar a 100 registros e contar localmente.
 */
function AdminPanel() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState(30);
  const [overview, setOverview] = useState({ resumoGeral: {}, obras: [], alertas: [] });
  const [exportMes, setExportMes] = useState(new Date().toISOString().slice(0, 7));
  const [exportObraId, setExportObraId] = useState("");
  const [exportErro, setExportErro] = useState(null);

  const handleExport = async (fn, label) => {
    try {
      setExportErro(null);
      await fn();
    } catch (err) {
      const msg = err?.response?.data?.error?.message
        || err?.message
        || `Não foi possível exportar ${label}.`;
      setExportErro(msg);
    }
  };

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

        // Visão gerencial — isolada para não quebrar os stats se falhar
        try {
          const overviewData = await getManagementOverview(periodo);
          setOverview(overviewData);
        } catch {
          // mantém overview com fallback silencioso — seção fica zerada mas stats carregam
        }
      } catch (err) {
        setErro("Não foi possível carregar as estatísticas do sistema.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [periodo]);

  const formatCurrency = (v) =>
    (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatStatus = (s) => {
    const MAP = {
      em_andamento: "Em andamento",
      planejamento:  "Planejamento",
      concluida:     "Concluída",
      paralisada:    "Paralisada",
      ativa:         "Ativa",
    };
    return MAP[s] || s;
  };

  const StatCard = ({ label, value, sub, destaque, variant }) => (
    <div className={`admin-stat-card${variant ? ` admin-stat-card--${variant}` : ""}`}>
      <p className="admin-stat-label">{label}</p>
      <p className={`admin-stat-value${destaque ? " admin-stat-value--destaque" : ""}`}>
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
          <p className="admin-loading">Carregando estatísticas…</p>
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
                variant={stats.medicoesPendentes > 0 ? "warning" : "success"}
              />
              <StatCard
                label="Total de solicitações"
                value={stats.totalSolicitacoes}
                sub={`${stats.solicitacoesPendentes ?? "—"} pendentes de aprovação`}
                destaque={stats.solicitacoesPendentes > 0}
                variant={stats.solicitacoesPendentes > 0 ? "danger" : "success"}
              />
              <StatCard
                label="Total de arquivos"
                value={stats.totalArquivos}
                sub="documentos e fotos enviados"
                variant="success"
              />
            </div>

            {/* Ações rápidas */}
            <hr className="section-divider" />
            <h2 className="section-title">Ações Rápidas</h2>

            <div className="card" style={{ marginBottom: "var(--espacamento-md)" }}>
              <div className="admin-card-header">
                <h3 className="admin-card-title">Visão Gerencial</h3>
                <div className="admin-period-row">
                  <label htmlFor="periodo-gerencial">Período (dias):</label>
                  <select
                    id="periodo-gerencial"
                    value={periodo}
                    onChange={(e) => setPeriodo(Number(e.target.value))}
                  >
                    <option value={7}>7</option>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                  </select>
                </div>
              </div>

              <div className="admin-grid">
                <StatCard label="Total orçado"       value={formatCurrency(overview?.resumoGeral?.totalOrcado)} />
                <StatCard label="Total realizado"    value={formatCurrency(overview?.resumoGeral?.totalRealizado)} variant="success" />
                <StatCard label="Obras em alerta"    value={overview?.resumoGeral?.obrasEmAlerta || 0}  destaque={(overview?.resumoGeral?.obrasEmAlerta || 0) > 0} variant={(overview?.resumoGeral?.obrasEmAlerta || 0) > 0 ? "warning" : undefined} />
                <StatCard label="Pendências de compra" value={overview?.resumoGeral?.solicitacoesPendentes || 0} sub={`Estimado: ${formatCurrency(overview?.resumoGeral?.valorPendenteEstimado)}`} variant={(overview?.resumoGeral?.solicitacoesPendentes || 0) > 0 ? "danger" : undefined} />
              </div>

              {Array.isArray(overview?.alertas) && overview.alertas.length > 0 && (
                <div style={{ marginTop: "var(--espacamento-md)" }}>
                  <h4 style={{ margin: "0 0 var(--espacamento-sm) 0", color: "var(--cor-aviso)" }}>⚠ Alertas de orçamento</h4>
                  {overview.alertas.map((obra) => (
                    <div key={obra.obraId} className="admin-alerta-card">
                      <strong>{obra.nome}</strong>
                      <p style={{ margin: "6px 0 0 0", fontSize: "var(--tamanho-fonte-pequena)" }}>
                        Gasto: {obra.percentualGasto}% ({formatCurrency(obra.realizado)} de {formatCurrency(obra.orcado)})
                      </p>
                      {obra.alertaPrazo && (
                        <p className="admin-alerta-prazo">
                          Prazo em risco: {obra.prazoDiasRestantes} dia(s) restantes para término previsto.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Obra</th>
                      <th>Status</th>
                      <th className="text-right">Orçado</th>
                      <th className="text-right">Realizado</th>
                      <th className="text-right">% gasto</th>
                      <th className="text-right">Prazo (dias)</th>
                      <th className="text-right">Medições ({periodo}d)</th>
                      <th className="text-right">Sol. pendentes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.obras || []).map((obra) => (
                      <tr key={obra.obraId}>
                        <td>{obra.nome}</td>
                        <td>
                          <span className={`obra-status ${obra.status}`}>{formatStatus(obra.status)}</span>
                        </td>
                        <td className="text-right">{formatCurrency(obra.orcado)}</td>
                        <td className="text-right">{formatCurrency(obra.realizado)}</td>
                        <td className={`text-right ${obra.percentualGasto >= 80 ? "valor-alerta" : ""}`}>
                          {obra.percentualGasto}%
                        </td>
                        <td className={`text-right ${obra.alertaPrazo ? "valor-alerta" : ""}`}>
                          {obra.prazoDiasRestantes ?? "—"}
                        </td>
                        <td className="text-right">{obra.medicoesPeriodo}</td>
                        <td className="text-right">{obra.solicitacoesPendentes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-export-area">
                <p className="admin-export-section-title">Exportar dados</p>

                <div className="admin-export-filters">
                  <select
                    value={exportObraId}
                    onChange={(e) => setExportObraId(e.target.value)}
                    aria-label="Filtrar por obra"
                  >
                    <option value="">Todas as obras</option>
                    {(overview?.obras || []).map((obra) => (
                      <option key={obra.obraId} value={obra.obraId}>{obra.nome}</option>
                    ))}
                  </select>

                  <input
                    type="month"
                    value={exportMes}
                    onChange={(e) => setExportMes(e.target.value)}
                    aria-label="Mês de referência"
                  />
                </div>

                <div className="admin-export-buttons">
                  <button className="button-secondary" onClick={() => handleExport(() => downloadManagementCsv(periodo), "visão gerencial")}>
                    Gerencial (CSV)
                  </button>
                  <button className="button-secondary" onClick={() => handleExport(() => downloadMedicoesCsv({ obraId: exportObraId || undefined, mes: exportMes || undefined }), "boletim CSV")}>
                    Boletim (CSV)
                  </button>
                  <button className="button-secondary admin-export-btn-pdf" onClick={() => handleExport(() => downloadBoletimPdf({ obraId: exportObraId || undefined, mes: exportMes || undefined }), "boletim PDF")}>
                    Boletim (PDF)
                  </button>
                </div>

                {exportErro && (
                  <p style={{ color: "var(--cor-perigo)", fontSize: "var(--tamanho-fonte-pequena)", margin: 0 }}>
                    {exportErro}
                  </p>
                )}
              </div>
            </div>

            <div className="buttons-container">
              <button className="topic-button" onClick={() => navigate("/obras")}>
                <span className="topic-button-icon"><Icon name="building" size={22} /></span>
                <span className="topic-button-title">Gerenciar Obras</span>
                <span className="topic-button-desc">Ver todas as obras cadastradas</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/medicoes-lista")}>
                <span className="topic-button-icon"><Icon name="checklist" size={22} /></span>
                <span className="topic-button-title">Aprovar Medições</span>
                <span className="topic-button-desc">Revisar e aprovar medições pendentes</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/status-solicitacoes")}>
                <span className="topic-button-icon"><Icon name="cart" size={22} /></span>
                <span className="topic-button-title">Aprovar Solicitações</span>
                <span className="topic-button-desc">Revisar e aprovar solicitações de materiais</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/relatorios")}>
                <span className="topic-button-icon"><Icon name="chart" size={22} /></span>
                <span className="topic-button-title">Relatórios</span>
                <span className="topic-button-desc">Ver relatórios e indicadores das obras</span>
              </button>
              <button className="topic-button" onClick={() => navigate("/register")}>
                <span className="topic-button-icon"><Icon name="person-add" size={22} /></span>
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
