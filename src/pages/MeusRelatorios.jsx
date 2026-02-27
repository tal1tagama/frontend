import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { listMedicoes } from "../services/medicoesService";
import api from "../services/api";
import "../styles/pages.css";

const BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function getFotoUrl(m) {
  const caminho = m.foto || m.fotoUrl || m.arquivo || m.arquivoUrl;
  const source = caminho || m.resolvedFotoUrl;

  if (!source) return null;
  // URL já absoluta → usa direto
  if (source.startsWith("http")) return source;
  // URL relativa (ex: /uploads/fotos/...) → prefixar com base do backend
  return `${BASE_URL}${source.startsWith("/") ? "" : "/"}${source}`;
}

function MeusRelatorios() {

  const [medicoes, setMedicoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeMedicao = (m) => {
    const itens = Array.isArray(m.itens) ? m.itens : [];
    const firstItem = itens[0] || {};
    return {
      id: m.id || m._id,
      descricao: m.descricao || firstItem.descricao,
      observacoes: m.observacoes || firstItem.observacoes,
      area: m.area ?? firstItem.quantidade,
      volume: m.volume ?? firstItem.valorTotal,
      foto: m.foto || m.fotoUrl || m.arquivo || m.arquivoUrl,
      anexos: Array.isArray(m.anexos) ? m.anexos : [],
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
        const normalized = list.map(normalizeMedicao);

        const withFileUrls = await Promise.all(
          normalized.map(async (medicao) => {
            const firstAnexoId = Array.isArray(medicao.anexos) ? medicao.anexos[0] : null;
            if (!firstAnexoId || typeof firstAnexoId !== "number") {
              return medicao;
            }

            try {
              const fileRes = await api.get(`/files/${firstAnexoId}`);
              const fileUrl = fileRes?.data?.data?.url || null;
              return { ...medicao, resolvedFotoUrl: fileUrl };
            } catch (error) {
              return medicao;
            }
          })
        );

        setMedicoes(withFileUrls);
      } catch (err) {
        console.error("Erro medicoes:", err);
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

        <h2 className="page-title">Meus Relatórios</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {loading && <p>Carregando medicoes...</p>}

        {!erro && !loading && medicoes.length === 0 && (
          <p>Nenhuma medição enviada.</p>
        )}

        {!loading && medicoes.map((m, idx) => {
          const fotoUrl = getFotoUrl(m);
          return (
            <div key={m.id || idx} className="card">

              {m.descricao && <p><strong>Descrição:</strong> {m.descricao}</p>}
              {m.observacoes && <p><strong>Observações:</strong> {m.observacoes}</p>}
              {(m.area !== undefined) && <p><strong>Área:</strong> {m.area} m²</p>}
              {(m.volume !== undefined) && <p><strong>Volume:</strong> {m.volume} m³</p>}
              {m.createdAt && (
                <p><strong>Data:</strong> {new Date(m.createdAt).toLocaleDateString("pt-BR")}</p>
              )}

              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Foto da medição"
                  width="200"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <p className="sem-foto">Sem foto anexada</p>
              )}

            </div>
          );
        })}

      </div>
    </Layout>
  );
}

export default MeusRelatorios;