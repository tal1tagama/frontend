// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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

        const overviewData = await getManagementOverview(periodo);
        setOverview(overviewData);
      } catch (err) {
        console.error("Erro ao carregar stats:", err);
        setErro("Não foi possível carregar as estatísticas do sistema.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [periodo]);

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

            <div className="card" style={{ marginBottom: "var(--espacamento-md)" }}>
              <h3 style={{ marginTop: 0 }}>Visão Gerencial</h3>
              <div style={{ display: "flex", gap: "var(--espacamento-sm)", flexWrap: "wrap", alignItems: "center" }}>
                <label htmlFor="periodo-gerencial" style={{ fontWeight: 600 }}>Período (dias):</label>
                <select
                  id="periodo-gerencial"
                  value={periodo}
                  onChange={(e) => setPeriodo(Number(e.target.value))}
                  style={{ maxWidth: "140px" }}
                >
                  <option value={7}>7</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={60}>60</option>
                </select>
              </div>

              <div className="admin-grid" style={{ marginTop: "var(--espacamento-md)" }}>
                <StatCard label="Total orçado" value={`R$ ${(overview?.resumoGeral?.totalOrcado || 0).toFixed(2)}`} />
                <StatCard label="Total realizado" value={`R$ ${(overview?.resumoGeral?.totalRealizado || 0).toFixed(2)}`} />
                <StatCard label="Obras em alerta" value={overview?.resumoGeral?.obrasEmAlerta || 0} destaque={(overview?.resumoGeral?.obrasEmAlerta || 0) > 0} />
                <StatCard label="Pendências de compra" value={overview?.resumoGeral?.solicitacoesPendentes || 0} sub={`Estimado: R$ ${(overview?.resumoGeral?.valorPendenteEstimado || 0).toFixed(2)}`} />
              </div>

              {Array.isArray(overview?.alertas) && overview.alertas.length > 0 && (
                <div style={{ marginTop: "var(--espacamento-md)" }}>
                  <h4 style={{ marginBottom: "var(--espacamento-sm)" }}>Alertas de orçamento</h4>
                  {overview.alertas.map((obra) => (
                    <div key={obra.obraId} className="card" style={{ marginBottom: "var(--espacamento-sm)", borderLeft: "4px solid var(--cor-aviso)" }}>
                      <strong>{obra.nome}</strong>
                      <p style={{ margin: "6px 0 0 0" }}>
                        Gasto: {obra.percentualGasto}% (R$ {obra.realizado.toFixed(2)} de R$ {obra.orcado.toFixed(2)})
                      </p>
                      {obra.alertaPrazo && (
                        <p style={{ margin: "4px 0 0 0", color: "var(--cor-perigo)", fontWeight: 600 }}>
                          Prazo em risco: {obra.prazoDiasRestantes} dia(s) restantes para término previsto.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "var(--espacamento-md)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "760px" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "8px" }}>Obra</th>
                      <th style={{ textAlign: "left", padding: "8px" }}>Status</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>Orçado</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>Realizado</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>% gasto</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>Prazo (dias)</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>Medições ({periodo}d)</th>
                      <th style={{ textAlign: "right", padding: "8px" }}>Solicitações pendentes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.obras || []).map((obra) => (
                      <tr key={obra.obraId}>
                        <td style={{ padding: "8px", borderTop: "1px solid var(--cor-borda)" }}>{obra.nome}</td>
                        <td style={{ padding: "8px", borderTop: "1px solid var(--cor-borda)" }}>{obra.status}</td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)" }}>R$ {obra.orcado.toFixed(2)}</td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)" }}>R$ {obra.realizado.toFixed(2)}</td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)", color: obra.percentualGasto >= 80 ? "var(--cor-perigo)" : "inherit", fontWeight: obra.percentualGasto >= 80 ? 700 : 500 }}>
                          {obra.percentualGasto}%
                        </td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)", color: obra.alertaPrazo ? "var(--cor-perigo)" : "inherit", fontWeight: obra.alertaPrazo ? 700 : 500 }}>
                          {obra.prazoDiasRestantes ?? "—"}
                        </td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)" }}>{obra.medicoesPeriodo}</td>
                        <td style={{ padding: "8px", textAlign: "right", borderTop: "1px solid var(--cor-borda)" }}>{obra.solicitacoesPendentes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: "var(--espacamento-md)", display: "flex", gap: "var(--espacamento-sm)", flexWrap: "wrap", alignItems: "center" }}>
                <button className="button-secondary" onClick={() => downloadManagementCsv(periodo)}>
                  Exportar visão gerencial (CSV)
                </button>

                <select
                  value={exportObraId}
                  onChange={(e) => setExportObraId(e.target.value)}
                  style={{ maxWidth: "240px" }}
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
                  style={{ maxWidth: "170px" }}
                />

                <button
                  className="button-secondary"
                  onClick={() => downloadMedicoesCsv({ obraId: exportObraId || undefined, mes: exportMes || undefined })}
                >
                  Exportar boletim (CSV)
                </button>

                <button
                  className="button-primary"
                  onClick={() => downloadBoletimPdf({ obraId: exportObraId || undefined, mes: exportMes || undefined })}
                >
                  Exportar boletim (PDF)
                </button>
              </div>
            </div>

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
