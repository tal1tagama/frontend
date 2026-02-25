import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { listMedicoes } from "../services/medicoesService";
import "../styles/pages.css";

function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

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
        const res = await listMedicoes({ page: 1, limit: 50 });
        const raw = Array.isArray(res) ? res : res?.data || [];
        const list = Array.isArray(raw) ? raw : raw?.data || [];
        setMeasurements(list.map(normalizeMedicao));
      } catch (err) {
        console.error("Erro ao buscar medicoes:", err);
        setErro("Nao foi possivel carregar as medicoes.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Lista de Medições</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {loading && <p>Carregando medicoes...</p>}

        {!erro && !loading && measurements.length === 0 && (
          <p>Nenhuma medição encontrada.</p>
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
                </tr>
              </thead>
              <tbody>
                {measurements.map((m, idx) => (
                  <tr key={m.id || idx}>
                    <td>{m.area ?? "—"}</td>
                    <td>{m.volume ?? "—"}</td>
                    <td>{m.observacoes || "—"}</td>
                    <td>{m.status || "—"}</td>
                    <td>{m.createdAt ? new Date(m.createdAt).toLocaleDateString("pt-BR") : "—"}</td>
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
