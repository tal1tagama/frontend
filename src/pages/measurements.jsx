import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  aprovarMedicao,
  listAllMedicoes,
  listMedicoes,
  rejeitarMedicao,
} from "../services/medicoesService";
import { extractApiMessage } from "../services/response";
import { AuthContext } from "../context/AuthContext";
import { isReviewer } from "../constants/permissions";
import "../styles/pages.css";

const STATUS_CLASS = {
  aprovada: "aprovada",
  rejeitada: "rejeitada",
  pendente: "pendente",
  enviada: "pendente",
};

function Measurements() {
  const { user } = useContext(AuthContext);
  const reviewer = isReviewer(user?.perfil);

  const [measurements, setMeasurements] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const normalizeMedicao = (m) => {
    const itens = Array.isArray(m.itens) ? m.itens : [];
    const firstItem = itens[0] || {};
    return {
      id: m.id || m._id,
      obra: m.obra || m.obraId || null,
      area: m.area ?? firstItem.quantidade,
      volume: m.volume ?? firstItem.valorTotal,
      observacoes: m.observacoes || firstItem.observacoes,
      status: m.status || "enviada",
      createdAt: m.createdAt || m.metadata?.createdAt,
    };
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      const res = reviewer
        ? await listAllMedicoes({ page: 1, limit: 50 })
        : await listMedicoes({ page: 1, limit: 50 });
      const list = Array.isArray(res) ? res : res?.data || [];
      setMeasurements(list.map(normalizeMedicao));
    } catch (err) {
      console.error("Erro ao buscar medicoes:", err);
      setErro("Não foi possível carregar as medições.");
    } finally {
      setLoading(false);
    }
  }, [reviewer]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await rejeitarMedicao(id);
      await load();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível rejeitar a medição."));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "1100px" }}>
        <h2 className="page-title">Lista de Medições</h2>
        <p className="page-description">
          {reviewer
            ? "Visualize e aprove as medições enviadas pelos encarregados."
            : "Suas medições enviadas e seus respectivos status."}
        </p>

        {erro && <p className="erro-msg">{erro}</p>}
        {loading && <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>Carregando medições...</p>}

        {!erro && !loading && measurements.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            <p>Nenhuma medição encontrada.</p>
          </div>
        )}

        {!loading && measurements.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="measurements-table">
              <thead>
                <tr>
                  {reviewer && <th>Obra</th>}
                  <th>Área (m²)</th>
                  <th>Volume (m³)</th>
                  <th>Observações</th>
                  <th>Status</th>
                  <th>Data</th>
                  {reviewer && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {measurements.map((m, idx) => (
                  <tr key={m.id || idx}>
                    {reviewer && <td>{m.obra ?? "—"}</td>}
                    <td><strong>{m.area != null ? Number(m.area).toFixed(2) : "—"}</strong></td>
                    <td><strong>{m.volume != null ? Number(m.volume).toFixed(2) : "—"}</strong></td>
                    <td>{m.observacoes || "—"}</td>
                    <td>
                      <span
                        className={`status-badge ${STATUS_CLASS[m.status] || "pendente"}`}
                        style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", fontSize: "var(--tamanho-fonte-pequena)", fontWeight: 700 }}
                      >
                        {m.status || "enviada"}
                      </span>
                    </td>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("pt-BR") : "—"}</td>
                    {reviewer && (
                      <td>
                        <div style={{ display: "flex", gap: "var(--espacamento-xs)" }}>
                          <button
                            className="button-success"
                            disabled={actionLoadingId === m.id || m.status === "aprovada"}
                            onClick={() => handleApprove(m.id)}
                            style={{ padding: "10px 16px" }}
                          >
                            Aprovar
                          </button>
                          <button
                            className="button-danger"
                            disabled={actionLoadingId === m.id || m.status === "rejeitada"}
                            onClick={() => handleReject(m.id)}
                            style={{ padding: "10px 16px" }}
                          >
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Measurements;
