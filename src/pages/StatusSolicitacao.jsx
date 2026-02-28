import { useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  aprovarPurchase,
  listPurchases,
  rejeitarPurchase,
} from "../services/purchasesService";
import { SOLICITACAO_STATUS_LABELS } from "../constants";
import { extractApiMessage } from "../services/response";
import { AuthContext } from "../context/AuthContext";
import { isReviewer } from "../constants/permissions";
import "../styles/pages.css";

function StatusSolicitacao() {
  const { user } = useContext(AuthContext);
  const reviewer = isReviewer(user?.perfil);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Estado do formulário de rejeição inline (uma por card)
  const [rejectTarget, setRejectTarget] = useState(null); // id da solicitação sendo rejeitada
  const [motivoRejeicao, setMotivoRejeicao] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErro(null);
      const res = await listPurchases();
      const list = Array.isArray(res) ? res : res?.data || [];
      setSolicitacoes(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Erro solicitacoes:", err);
      setErro("Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await aprovarPurchase(id);
      await load();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível aprovar a solicitação."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectForm = (id) => {
    setRejectTarget(id);
    setMotivoRejeicao("");
  };

  const cancelReject = () => {
    setRejectTarget(null);
    setMotivoRejeicao("");
  };

  const confirmReject = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await rejeitarPurchase(id, motivoRejeicao.trim());
      setRejectTarget(null);
      setMotivoRejeicao("");
      await load();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível rejeitar a solicitação."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const getItems = (s) => {
    if (typeof s.itens === "string") {
      try {
        const parsed = JSON.parse(s.itens);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) { /* continua */ }
    }
    if (Array.isArray(s.itens)) return s.itens;
    if (Array.isArray(s.items)) return s.items;
    if (Array.isArray(s.descricao)) return s.descricao;
    if (s.descricao) return [s.descricao];
    return [];
  };

  const statusLabel = (s) =>
    SOLICITACAO_STATUS_LABELS[s.status] || s.status || "Pendente";

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Status das Solicitações</h2>
        <p className="page-description">
          Acompanhe o andamento das solicitações de materiais.
          {reviewer && " Como supervisor, você pode aprovar ou rejeitar solicitações pendentes."}
        </p>

        {erro && <p className="erro-msg">{erro}</p>}
        {loading && <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>Carregando solicitações...</p>}

        {!erro && !loading && solicitacoes.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            <p>Nenhuma solicitação encontrada.</p>
          </div>
        )}

        {!loading && solicitacoes.map((s, idx) => (
          <div key={s._id || s.id || idx} className="card">

            {/* Cabeçalho do card */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--espacamento-md)" }}>
              <span className={`status-badge ${s.status || "pendente"}`}>
                {statusLabel(s)}
              </span>
              {s.prioridade && s.prioridade !== "media" && (
                <span style={{ fontSize: "var(--tamanho-fonte-pequena)", fontWeight: 600, color: "var(--cor-aviso)" }}>
                  Prioridade: {s.prioridade}
                </span>
              )}
            </div>

            {/* Lista de materiais */}
            {getItems(s).length > 0 && (
              <div>
                <strong style={{ fontSize: "var(--tamanho-fonte-base)", display: "block", marginBottom: "var(--espacamento-sm)" }}>
                  Materiais solicitados:
                </strong>
                <ul style={{ marginTop: "var(--espacamento-sm)", paddingLeft: "22px", lineHeight: "1.9" }}>
                  {getItems(s).map((item, i) => (
                    <li key={i} style={{ marginBottom: "var(--espacamento-xs)", fontSize: "var(--tamanho-fonte-base)" }}>
                      {item.descricao || item.nome || item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Motivo de rejeição (se houver) */}
            {s.motivoRejeicao && (
              <div style={{ marginTop: "var(--espacamento-md)", padding: "var(--espacamento-sm)", background: "var(--cor-perigo-clara)", borderRadius: "var(--borda-radius)", borderLeft: "4px solid var(--cor-perigo)" }}>
                <strong style={{ color: "var(--cor-perigo)" }}>Motivo da rejeição:</strong>
                <p style={{ margin: "4px 0 0 0", color: "var(--cor-perigo)" }}>{s.motivoRejeicao}</p>
              </div>
            )}

            {/* Data */}
            {(s.dataSolicitacao || s.createdAt) && (
              <p style={{ marginTop: "var(--espacamento-md)", color: "var(--cor-texto-secundario)", fontSize: "var(--tamanho-fonte-pequena)" }}>
                <strong>Data da solicitação:</strong>{" "}
                {new Date(s.dataSolicitacao || s.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </p>
            )}

            {/* Ações — apenas reviewer em solicitações pendentes */}
            {reviewer && s.status === "pendente" && rejectTarget !== (s.id || s._id) && (
              <div style={{ marginTop: "var(--espacamento-lg)", display: "flex", gap: "var(--espacamento-sm)", flexWrap: "wrap" }}>
                <button
                  className="button-success"
                  style={{ flex: 1, minWidth: "140px" }}
                  onClick={() => handleApprove(s.id || s._id)}
                  disabled={actionLoadingId === (s.id || s._id)}
                >
                  {actionLoadingId === (s.id || s._id) ? "Processando..." : "Aprovar"}
                </button>
                <button
                  className="button-danger"
                  style={{ flex: 1, minWidth: "140px" }}
                  onClick={() => openRejectForm(s.id || s._id)}
                  disabled={actionLoadingId === (s.id || s._id)}
                >
                  Rejeitar
                </button>
              </div>
            )}

            {/* Formulário inline de rejeição */}
            {reviewer && rejectTarget === (s.id || s._id) && (
              <div className="reject-form">
                <label htmlFor={`motivo-${s.id}`}>Informe o motivo da rejeição (opcional):</label>
                <textarea
                  id={`motivo-${s.id}`}
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Ex: Material fora do orçamento aprovado..."
                  rows={3}
                />
                <div className="reject-form-buttons">
                  <button
                    className="button-danger"
                    onClick={() => confirmReject(s.id || s._id)}
                    disabled={actionLoadingId === (s.id || s._id)}
                  >
                    {actionLoadingId === (s.id || s._id) ? "Rejeitando..." : "Confirmar Rejeição"}
                  </button>
                  <button
                    className="button-secondary"
                    onClick={cancelReject}
                    disabled={actionLoadingId === (s.id || s._id)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </Layout>
  );
}

export default StatusSolicitacao;
