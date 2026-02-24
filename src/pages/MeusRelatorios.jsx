import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

const BASE_URL = "http://localhost:5000";

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

  useEffect(() => {
    api.get("/medicoes")
      .then(res => {
        setMedicoes(Array.isArray(res.data) ? res.data : res.data?.data || []);
      })
      .catch(err => {
        console.error("Erro medicoes:", err);
        setErro("Não foi possível carregar as medições.");
      });
  }, []);

  return (
    <Layout>
      <div className="page-container">

        <h2 className="page-title">Meus Relatórios</h2>

        {erro && <p className="erro-msg">{erro}</p>}

        {!erro && medicoes.length === 0 && (
          <p>Nenhuma medição enviada.</p>
        )}

        {medicoes.map((m, idx) => {
          const fotoUrl = getFotoUrl(m);
          return (
            <div key={m._id || m.id || idx} className="card">

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