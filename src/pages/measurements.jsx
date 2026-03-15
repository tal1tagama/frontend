// src/pages/measurements.jsx
// Lista de Medições — visível para Supervisor e Admin.
// Permite filtrar por obra, status, período (data), responsável e tipo de serviço.
// Os filtros são enviados ao back-end via query params, evitando carregar
// toda a base de dados na memória do cliente.

import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  aprovarMedicao,
  listAllMedicoesPaginado,
  listMedicoesPaginado,
  rejeitarMedicao,
} from "../services/medicoesService";
import { extractApiMessage } from "../services/response";
import useObras from "../hooks/useObras";
import { AuthContext } from "../context/AuthContext";
import { isReviewer, isAdmin } from "../constants/permissions";
import { TIPOS_SERVICO, STATUS_CLASS, STATUS_LABEL } from "../constants/medicao";
import { normalizeMedicao } from "../utils/normalizeMedicao";
import { PAGE_LIMIT_MEDICOES } from "../constants/pagination";
import "../styles/pages.css";

const PAGE_LIMIT = PAGE_LIMIT_MEDICOES;

function Measurements() {
  const { user } = useContext(AuthContext);
  const reviewer = isReviewer(user?.perfil);
  const admin    = isAdmin(user?.perfil);

  const [measurements, setMeasurements] = useState([]);
  const { obras }                       = useObras(200);
  const [erro, setErro]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // ── Rejeição inline (sem window.prompt) ───────────────────────────────────
  const [rejectTargetId, setRejectTargetId] = useState(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems]   = useState(0);

  // ── filtros aplicados via query param ao back-end ───────────────────────────
  const [filtros, setFiltros] = useState({
    obra:        "",
    status:      "",
    tipoServico: "",
    dataInicio:  "",
    dataFim:     "",
    responsavel: "",   // busca textual local sobre responsavelNome (JOIN do back)
  });


  // Carrega medições; re-executa sempre que os filtros ou página mudam
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);

      // Envia somente os filtros não-vazios ao back-end
      const params = { page: currentPage, limit: PAGE_LIMIT };
      if (filtros.obra)        params.obra        = filtros.obra;
      if (filtros.status)      params.status      = filtros.status;
      if (filtros.tipoServico) params.tipoServico = filtros.tipoServico;
      if (filtros.dataInicio)  params.dataInicio  = `${filtros.dataInicio}T00:00:00`;
      if (filtros.dataFim)     params.dataFim     = `${filtros.dataFim}T23:59:59`;

      const res = reviewer
        ? await listAllMedicoesPaginado(params)
        : await listMedicoesPaginado(params);

      const list = Array.isArray(res.data) ? res.data : [];
      setMeasurements(list.map(normalizeMedicao));
      setTotalItems(res.pagination?.totalItems ?? list.length);
    } catch (err) {
      setErro("Não foi possível carregar as medições.");
    } finally {
      setLoading(false);
    }
  }, [reviewer, filtros, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await aprovarMedicao(id);
      await load();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível aprovar a medição."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = (id) => {
    setRejectTargetId(id);
    setMotivoRejeicao("");
  };

  const cancelReject = () => {
    setRejectTargetId(null);
    setMotivoRejeicao("");
  };

  const confirmReject = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await rejeitarMedicao(id, motivoRejeicao.trim());
      setRejectTargetId(null);
      setMotivoRejeicao("");
      await load();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível rejeitar a medição."));
    } finally {
      setActionLoadingId(null);
    }
  };

  // Ao mudar filtros, volta para página 1
  const handleFiltro = (e) => {
    const { name, value } = e.target;
    setCurrentPage(1);
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const limparFiltros = () => {
    setCurrentPage(1);
    setFiltros({ obra: "", status: "", tipoServico: "", dataInicio: "", dataFim: "", responsavel: "" });
  };

  const temFiltroAtivo = Object.values(filtros).some(Boolean);
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_LIMIT));

  // Filtro local por nome do responsável (todos os outros filtros já foram ao back-end)
  const listFiltrada = filtros.responsavel
    ? measurements.filter((m) =>
        (m.responsavelNome || "").toLowerCase().includes(filtros.responsavel.toLowerCase())
      )
    : measurements;

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "1200px" }}>
        <h1 className="page-title">Lista de Medições</h1>
        <p className="page-description">
          {reviewer
            ? "Visualize, filtre e aprove as medições enviadas pelos encarregados."
            : "Veja todas as suas medições enviadas e os respectivos status de aprovação."}
        </p>

        {/* ── Painel de Filtros ─────────────────────────────────────────────── */}
        <div
          className="form-container"
          style={{ marginBottom: "var(--espacamento-lg)", padding: "var(--espacamento-md)" }}
        >
          <p style={{ fontWeight: 700, marginBottom: "var(--espacamento-md)", color: "var(--cor-texto-principal)" }}>
            Filtros
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "var(--espacamento-md)",
            alignItems: "end",
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="f-obra">Obra</label>
              <select id="f-obra" name="obra" value={filtros.obra} onChange={handleFiltro}>
                <option value="">Todas</option>
                {obras.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nome || `Obra #${o.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="f-status">Status</label>
              <select id="f-status" name="status" value={filtros.status} onChange={handleFiltro}>
                <option value="">Todos</option>
                <option value="enviada">Enviada</option>
                <option value="aprovada">Aprovada</option>
                <option value="rejeitada">Rejeitada</option>
                <option value="rascunho">Rascunho</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="f-tipo">Tipo de serviço</label>
              <select id="f-tipo" name="tipoServico" value={filtros.tipoServico} onChange={handleFiltro}>
                <option value="">Todos</option>
                {TIPOS_SERVICO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="f-ini">Data início</label>
              <input id="f-ini" type="date" name="dataInicio" value={filtros.dataInicio} onChange={handleFiltro} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="f-fim">Data fim</label>
              <input id="f-fim" type="date" name="dataFim" value={filtros.dataFim} onChange={handleFiltro} />
            </div>

            {/* Busca textual por responsável — somente para revisores */}
            {(reviewer || admin) && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="f-resp">Responsável</label>
                <input
                  id="f-resp"
                  type="text"
                  name="responsavel"
                  placeholder="Nome do responsável"
                  value={filtros.responsavel}
                  onChange={handleFiltro}
                />
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                className="button-secondary"
                onClick={limparFiltros}
                disabled={!temFiltroAtivo}
                style={{ width: "100%", padding: "15px 12px" }}
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* ── Feedbacks ────────────────────────────────────────────────────── */}
        {erro && <p className="erro-msg">{erro}</p>}
        {loading && (
          <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            Carregando medições...
          </p>
        )}

        {/* ── Painel de Rejeição Inline ────────────────────────────────────── */}
        {rejectTargetId !== null && (
          <div className="reject-form" style={{ marginBottom: "var(--espacamento-lg)" }}>
            <label htmlFor="motivo-rejeicao">
              Informe o motivo da rejeição (opcional):
            </label>
            <textarea
              id="motivo-rejeicao"
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Ex: Medição incompleta, dados inconsistentes..."
              rows={3}
            />
            <div className="reject-form-buttons">
              <button
                className="button-danger"
                onClick={() => confirmReject(rejectTargetId)}
                disabled={actionLoadingId === rejectTargetId}
              >
                {actionLoadingId === rejectTargetId ? "Rejeitando..." : "Confirmar Rejeição"}
              </button>
              <button
                className="button-secondary"
                onClick={cancelReject}
                disabled={actionLoadingId === rejectTargetId}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {!erro && !loading && listFiltrada.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            <p>
              {measurements.length === 0
                ? "Nenhuma medição encontrada."
                : "Nenhuma medição corresponde aos filtros informados."}
            </p>
          </div>
        )}

        {/* ── Tabela ───────────────────────────────────────────────────────── */}
        {!loading && listFiltrada.length > 0 && (
          <>
            <p style={{
              marginBottom: "var(--espacamento-md)",
              color: "var(--cor-texto-secundario)",
              fontSize: "var(--tamanho-fonte-pequena)",
            }}>
              Exibindo {listFiltrada.length} de {totalItems} medição{totalItems !== 1 ? "ões" : ""}
              {temFiltroAtivo ? " (filtros ativos)" : ""}.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table className="measurements-table">
                <thead>
                  <tr>
                    {reviewer && <th>Obra</th>}
                    {reviewer && <th>Responsável</th>}
                    <th>Área (m²)</th>
                    <th>Tipo de Serviço</th>
                    <th>Observações</th>
                    <th>Status</th>
                    <th>Data</th>
                    {reviewer && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {listFiltrada.map((m, idx) => (
                    <tr key={m.id || idx}>
                      {reviewer && (
                        <td>{m.obraNome || (m.obra ? `Obra #${m.obra}` : "—")}</td>
                      )}
                      {reviewer && (
                        <td>{m.responsavelNome || (m.responsavel ? `#${m.responsavel}` : "—")}</td>
                      )}
                      <td>
                        <strong>
                          {m.area != null && !isNaN(m.area) ? Number(m.area).toFixed(2) : "—"}
                        </strong>
                      </td>
                      <td>
                        {TIPOS_SERVICO.find((t) => t.value === m.tipoServico)?.label
                          || m.tipoServico
                          || "—"}
                      </td>
                      <td>{m.observacoes || "—"}</td>
                      <td>
                        <span
                          className={`status-badge ${STATUS_CLASS[m.status] || "pendente"}`}
                          style={{
                            display: "inline-block",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            fontSize: "var(--tamanho-fonte-pequena)",
                            fontWeight: 700,
                          }}
                        >
                          {STATUS_LABEL[m.status] || m.status || "Enviada"}
                        </span>
                      </td>
                      <td>
                        {m.createdAt
                          ? new Date(m.createdAt).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                      {reviewer && (
                        <td>
                          <div style={{ display: "flex", gap: "var(--espacamento-xs)" }}>
                            <button
                              className="button-success"
                              disabled={actionLoadingId === m.id || m.status === "aprovada" || rejectTargetId !== null}
                              onClick={() => handleApprove(m.id)}
                              style={{ padding: "10px 16px" }}
                            >
                              {actionLoadingId === m.id ? "Aprovando..." : "Aprovar"}
                            </button>
                            <button
                              className="button-danger"
                              disabled={actionLoadingId === m.id || m.status === "rejeitada"}
                              onClick={() => handleReject(m.id)}
                              style={{
                                padding: "10px 16px",
                                opacity: rejectTargetId === m.id ? 1 : undefined,
                                outline: rejectTargetId === m.id ? "2px solid #7f1d1d" : undefined,
                              }}
                            >
                              {rejectTargetId === m.id ? "✎ Motivo acima" : "Rejeitar"}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Controles de Paginação ────────────────────────────────── */}
            {totalPages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--espacamento-md)",
                marginTop: "var(--espacamento-xl)",
              }}>
                <button
                  className="button-secondary"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  style={{ padding: "8px 18px" }}
                >
                  ← Anterior
                </button>
                <span style={{ fontSize: "var(--tamanho-fonte-base)", color: "var(--cor-texto-secundario)" }}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className="button-secondary"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  style={{ padding: "8px 18px" }}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Measurements;

