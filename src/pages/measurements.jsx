import React, { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get("/medicoes")
      .then(res => {
        setMeasurements(Array.isArray(res.data) ? res.data : res.data?.data || []);
      })
      .catch(err => {
        console.error("Erro ao buscar medições:", err);
        setErro("Não foi possível carregar as medições.");
      });
  }, []);

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Lista de Medições</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {!erro && measurements.length === 0 && (
          <p>Nenhuma medição encontrada.</p>
        )}

        {measurements.length > 0 && (
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
                  <tr key={m._id || idx}>
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
