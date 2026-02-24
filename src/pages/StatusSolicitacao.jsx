import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

const STATUS_LABEL = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  em_andamento: "Em Andamento",
};

function StatusSolicitacao() {

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get("/solicitacoes")
      .then(res => {
        setSolicitacoes(Array.isArray(res.data) ? res.data : res.data?.data || []);
      })
      .catch(err => {
        console.error("Erro solicitacoes:", err);
        setErro("Não foi possível carregar as solicitações.");
      });
  }, []);

  return (
    <Layout>
      <div className="page-container">

        <h2 className="page-title">Status das Solicitações</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {!erro && solicitacoes.length === 0 && (
          <p>Nenhuma solicitação encontrada.</p>
        )}

        {solicitacoes.map((s, idx) => (
          <div key={s._id || s.id || idx} className="card">
            <p><strong>Status:</strong> {STATUS_LABEL[s.status] || s.status || "—"}</p>
            {s.descricao && (
              <div>
                <strong>Itens:</strong>
                <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                  {(Array.isArray(s.descricao) ? s.descricao : [s.descricao]).map((item, i) => (
                    <li key={i}>{item}</li>
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