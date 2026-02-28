// src/pages/GerenciarObras.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { listObras } from "../services/obrasService";
import "../styles/pages.css";

const STATUS_LABELS = {
  ativa: "Ativa",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  paralisada: "Paralisada",
  planejamento: "Planejamento",
};

function GerenciarObras() {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErro(null);
        const data = await listObras({ page: 1, limit: 100 });
        setObras(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar obras:", err);
        setErro("Não foi possível carregar as obras.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const obrasFiltradas = obras.filter((o) => {
    const nome = (o.nome || o.descricao || "").toLowerCase();
    const matchNome = nome.includes(busca.toLowerCase());
    const matchStatus = filtroStatus ? o.status === filtroStatus : true;
    return matchNome && matchStatus;
  });

  return (
    <Layout>
      <div className="page-container" style={{ maxWidth: "1000px" }}>
        <h1 className="page-title">Obras</h1>
        <p className="page-description">
          Lista de obras cadastradas no sistema.
        </p>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "var(--espacamento-md)", flexWrap: "wrap", marginBottom: "var(--espacamento-lg)" }}>
          <div className="form-group" style={{ flex: 1, minWidth: "200px", marginBottom: 0 }}>
            <label htmlFor="busca">Buscar pelo nome</label>
            <input
              id="busca"
              type="text"
              placeholder="Digite o nome da obra..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: "0 0 200px", marginBottom: 0 }}>
            <label htmlFor="filtroStatus">Status</label>
            <select
              id="filtroStatus"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="ativa">Ativa</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
              <option value="paralisada">Paralisada</option>
              <option value="planejamento">Planejamento</option>
            </select>
          </div>
        </div>

        {/* Feedback */}
        {erro && <p className="erro-msg">{erro}</p>}
        {loading && (
          <p style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            Carregando obras...
          </p>
        )}

        {!loading && !erro && obrasFiltradas.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "var(--espacamento-xl)" }}>
            <p>
              {obras.length === 0
                ? "Nenhuma obra cadastrada."
                : "Nenhuma obra encontrada para os filtros informados."}
            </p>
          </div>
        )}

        {/* Cards de obras */}
        {!loading && (
          <div className="obras-list">
            {obrasFiltradas.map((obra, idx) => (
              <div key={obra.id || idx} className="obra-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--espacamento-sm)" }}>
                  <h3>{obra.nome || obra.descricao || `Obra #${obra.id}`}</h3>
                  <span className={`obra-status ${obra.status || "ativa"}`}>
                    {STATUS_LABELS[obra.status] || obra.status || "Ativa"}
                  </span>
                </div>

                {obra.endereco && typeof obra.endereco === "string" && (
                  <p style={{ fontSize: "var(--tamanho-fonte-pequena)", color: "var(--cor-texto-secundario)", margin: "0 0 var(--espacamento-xs) 0" }}>
                    <strong>Endereço:</strong> {obra.endereco}
                  </p>
                )}

                {obra.descricao && (
                  <p style={{ fontSize: "var(--tamanho-fonte-pequena)", color: "var(--cor-texto-secundario)", margin: "0 0 var(--espacamento-xs) 0" }}>
                    {obra.descricao}
                  </p>
                )}

                {obra.dataInicio && (
                  <p style={{ fontSize: "var(--tamanho-fonte-pequena)", color: "var(--cor-texto-secundario)", margin: "0 0 var(--espacamento-xs) 0" }}>
                    <strong>Início:</strong>{" "}
                    {new Date(obra.dataInicio).toLocaleDateString("pt-BR")}
                  </p>
                )}

                {obra.dataPrevisaoTermino && (
                  <p style={{ fontSize: "var(--tamanho-fonte-pequena)", color: "var(--cor-texto-secundario)", margin: "0" }}>
                    <strong>Previsão de término:</strong>{" "}
                    {new Date(obra.dataPrevisaoTermino).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && obrasFiltradas.length > 0 && (
          <p style={{ marginTop: "var(--espacamento-lg)", color: "var(--cor-texto-secundario)", fontSize: "var(--tamanho-fonte-pequena)" }}>
            Exibindo {obrasFiltradas.length} de {obras.length} {obras.length === 1 ? "obra" : "obras"}.
          </p>
        )}
      </div>
    </Layout>
  );
}

export default GerenciarObras;
