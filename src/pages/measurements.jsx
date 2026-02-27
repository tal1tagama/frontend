import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  aprovarMedicao,
  listAllMedicoes,
  listMedicoes,
  rejeitarMedicao,
} from "../services/medicoesService";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );
  const isReviewer = useMemo(
    () => ["supervisor", "admin"].includes(currentUser?.perfil),
    [currentUser?.perfil]
  );

  const normalizeMedicao = (m) => {
    const itens = Array.isArray(m.itens) ? m.itens : [];
    const firstItem = itens[0] || {};
    return {
      id: m.id || m._id,
      area: m.area ?? firstItem.quantidade,
      volume: m.volume ?? firstItem.valorTotal,
      observacoes: m.observacoes || firstItem.observacoes,
      status: m.status,
      createdAt: m.createdAt || m.metadata?.createdAt,
    };
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErro(null);
        // Supervisores/admins vêem TODAS as medições via GET /measurements
        // Encarregados vêem apenas as próprias via GET /measurements/minhas
        const res = isReviewer
          ? await listAllMedicoes({ page: 1, limit: 50 })
          : await listMedicoes({ page: 1, limit: 50 });
        const list = Array.isArray(res) ? res : res?.data || [];
        setMeasurements(list.map(normalizeMedicao));
      } catch (err) {
        console.error("Erro ao buscar medicoes:", err);
        setErro("Nao foi possivel carregar as medicoes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isReviewer]);

  const refreshList = async () => {
    try {
      const res = isReviewer
        ? await listAllMedicoes({ page: 1, limit: 50 })
        : await listMedicoes({ page: 1, limit: 50 });
      const list = Array.isArray(res) ? res : res?.data || [];
      setMeasurements(list.map(normalizeMedicao));
    } catch {
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      setErro(null);
      await aprovarMedicao(id);
      await refreshList();
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
      await refreshList();
    } catch (error) {
      setErro(extractApiMessage(error, "Não foi possível rejeitar a medição."));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "1200px" }}>
        <h2 className="page-title">Lista de Medições</h2>
        <p style={{ fontSize: "var(--tamanho-fonte-base)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-lg)" }}>
          {isReviewer ? "Visualize e aprove medições enviadas" : "Suas medições enviadas"}
        </p>

        {erro && <p className="erro-msg">{erro}</p>}

        {loading && <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>Carregando medições...</p>}

        {!erro && !loading && measurements.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            <p style={{ color: "var(--cor-texto-secundario)" }}>Nenhuma medição encontrada.</p>
          </div>
        )}

        {!loading && measurements.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="measurements-table">
              <thead>
                <tr>
                  <th>Área (m²)</th>
                  <th>Volume (m³)</th>
                  <th>Observações</th>
                  <th>Status</th>
                  <th>Data</th>
                  {isReviewer && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {measurements.map((m, idx) => (
                  <tr key={m.id || idx}>
                    <td><strong>{m.area ?? "—"}</strong></td>
                    <td><strong>{m.volume ?? "—"}</strong></td>
                    <td>{m.observacoes || "—"}</td>
                    <td>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        fontSize: "var(--tamanho-fonte-pequena)", 
                        fontWeight: 500,
                        background: m.status === "aprovada" ? "var(--cor-sucesso-clara)" : 
                                   m.status === "rejeitada" ? "var(--cor-perigo-clara)" : 
                                   "var(--cor-aviso-clara)",
                        color: m.status === "aprovada" ? "var(--cor-sucesso)" : 
                               m.status === "rejeitada" ? "var(--cor-perigo)" : 
                               "var(--cor-aviso)"
                      }}>
                        {m.status || "pendente"}
                      </span>
                    </td>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("pt-BR") : "—"}</td>
                    {isReviewer && (
                      <td>
                        <div style={{ display: "flex", gap: "var(--espacamento-xs)" }}>
                          <button
                            className="button-primary"
                            disabled={actionLoadingId === m.id || m.status === "aprovada"}
                            onClick={() => handleApprove(m.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="button-danger"
                            disabled={actionLoadingId === m.id || m.status === "rejeitada"}
                            onClick={() => handleReject(m.id)}
                          >
                            ✗
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
