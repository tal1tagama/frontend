import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  aprovarPurchase,
  listPurchases,
  rejeitarPurchase,
} from "../services/purchasesService";
import { SOLICITACAO_STATUS_LABELS } from "../constants";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

function StatusSolicitacao() {

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isReviewer = ["supervisor", "admin"].includes(currentUser?.perfil);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErro(null);
        const res = await listPurchases();
        const list = Array.isArray(res) ? res : res?.data || [];
        setSolicitacoes(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Erro solicitacoes:", err);
        setErro("Nao foi possivel carregar as solicitacoes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const refreshSolicitacoes = async () => {
    try {
      const res = await listPurchases();
      const list = Array.isArray(res) ? res : res?.data || [];
      setSolicitacoes(Array.isArray(list) ? list : []);
    } catch {
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await aprovarPurchase(id);
      await refreshSolicitacoes();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível aprovar a solicitação."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const motivoRejeicao = window.prompt("Informe o motivo da rejeição (opcional):", "") || "";

    try {
      setActionLoadingId(id);
      setErro(null);
      await rejeitarPurchase(id, motivoRejeicao);
      await refreshSolicitacoes();
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
      } catch (error) {
      }
    }
    if (Array.isArray(s.itens)) return s.itens;
    if (Array.isArray(s.items)) return s.items;
    if (Array.isArray(s.descricao)) return s.descricao;
    if (s.descricao) return [s.descricao];
    return [];
  };

  return (
    <Layout>
      <div className="page-container">

        <h2 className="page-title">Status das Solicitações</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {loading && <p>Carregando solicitacoes...</p>}

        {!erro && !loading && solicitacoes.length === 0 && (
          <p>Nenhuma solicitação encontrada.</p>
        )}

        {!loading && solicitacoes.map((s, idx) => (
          <div key={s._id || s.id || idx} className="card">
            <p><strong>Status:</strong> {SOLICITACAO_STATUS_LABELS[s.status] || s.status || "—"}</p>
            {getItems(s).length > 0 && (
              <div>
                <strong>Itens:</strong>
                <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                  {getItems(s).map((item, i) => (
                    <li key={i}>{item.descricao || item.nome || item}</li>
                  ))}
                </ul>
              </div>
            )}
            {(s.dataSolicitacao || s.createdAt) && (
              <p><strong>Data:</strong> {new Date(s.dataSolicitacao || s.createdAt).toLocaleDateString("pt-BR")}</p>
            )}
            {isReviewer && s.status === "pendente" && (
              <div style={{ marginTop: 12 }}>
                <button
                  className="button-primary"
                  style={{ marginRight: 8 }}
                  onClick={() => handleApprove(s.id)}
                  disabled={actionLoadingId === s.id}
                >
                  Aprovar
                </button>
                <button
                  className="button-danger"
                  onClick={() => handleReject(s.id)}
                  disabled={actionLoadingId === s.id}
                >
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        ))}

      </div>
    </Layout>
  );
}

export default StatusSolicitacao;