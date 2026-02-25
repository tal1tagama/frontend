import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { listPurchases } from "../services/purchasesService";
import { SOLICITACAO_STATUS_LABELS } from "../constants";
import "../styles/pages.css";

function StatusSolicitacao() {

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErro(null);
        const res = await listPurchases();
        const list = res?.data || res?.data?.data || res || [];
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

  const getItems = (s) => {
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
            {s.createdAt && (
              <p><strong>Data:</strong> {new Date(s.createdAt).toLocaleDateString("pt-BR")}</p>
            )}
          </div>
        ))}

      </div>
    </Layout>
  );
}

export default StatusSolicitacao;