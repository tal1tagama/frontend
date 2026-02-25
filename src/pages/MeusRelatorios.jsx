import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { listMedicoes } from "../services/medicoesService";
import "../styles/pages.css";

const BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function getFotoUrl(m) {
  const caminho = m.foto || m.fotoUrl || m.arquivo || m.arquivoUrl;

  if (!caminho) return null;
  // URL já absoluta → usa direto
  if (caminho.startsWith("http")) return caminho;
  // URL relativa (ex: /uploads/fotos/...) → prefixar com base do backend
  return `${BASE_URL}${caminho.startsWith("/") ? "" : "/"}${caminho}`;
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
        setMedicoes(list.map(normalizeMedicao));
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
          const fotoUrl = getFotoUrl({ foto: m.foto });
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