import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { createDiario, listMeusDiarios } from "../services/diariosService";
import { listObras } from "../services/obrasService";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

const CLIMAS = ["ensolarado", "nublado", "chuvoso", "ventania", "instavel"];

export default function DiarioObra() {
  const [form, setForm] = useState({
    obra: "",
    data: new Date().toISOString().slice(0, 10),
    clima: "",
    atividades: "",
    ocorrencias: "",
    observacoesGerais: "",
  });

  const [obras, setObras] = useState([]);
  const [loadingObras, setLoadingObras] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recentes, setRecentes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingObras(true);
        const [obrasData, diariosData] = await Promise.all([
          listObras({ page: 1, limit: 100 }),
          listMeusDiarios({ page: 1, limit: 5 }),
        ]);

        const listaObras = Array.isArray(obrasData) ? obrasData : [];
        setObras(listaObras);
        if (listaObras.length === 1) {
          setForm((prev) => ({ ...prev, obra: String(listaObras[0].id) }));
        }

        setRecentes(Array.isArray(diariosData?.data) ? diariosData.data : []);
      } catch {
        setError("Não foi possível carregar dados do diário.");
      } finally {
        setLoadingObras(false);
      }
    };

    loadData();
  }, []);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function mapLinesToArray(text) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((descricao) => ({ descricao }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.obra) {
      setError("Selecione a obra do diário.");
      return;
    }

    if (!form.atividades.trim()) {
      setError("Informe pelo menos uma atividade do dia.");
      return;
    }

    const payload = {
      obra: Number(form.obra),
      data: new Date(`${form.data}T12:00:00`).toISOString(),
      clima: form.clima || null,
      atividades: mapLinesToArray(form.atividades),
      ocorrencias: mapLinesToArray(form.ocorrencias),
      observacoesGerais: form.observacoesGerais || null,
    };

    try {
      setLoading(true);
      await createDiario(payload);
      setSuccess("Diário registrado com sucesso.");
      setForm((prev) => ({
        ...prev,
        atividades: "",
        ocorrencias: "",
        observacoesGerais: "",
      }));

      const diariosData = await listMeusDiarios({ page: 1, limit: 5 });
      setRecentes(Array.isArray(diariosData?.data) ? diariosData.data : []);
    } catch (err) {
      setError(extractApiMessage(err, "Erro ao registrar diário."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h1 className="page-title">Diário de Obra</h1>
        <p className="page-description">
          Registre as atividades diárias da obra para manter o escritório atualizado.
        </p>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="obra">Obra *</label>
            {loadingObras ? (
              <select disabled>
                <option>Carregando obras...</option>
              </select>
            ) : (
              <select id="obra" name="obra" value={form.obra} onChange={handleChange} required>
                {obras.length > 1 && <option value="">Selecione a obra</option>}
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>{obra.nome || `Obra #${obra.id}`}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="data">Data *</label>
            <input id="data" name="data" type="date" value={form.data} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="clima">Clima</label>
            <select id="clima" name="clima" value={form.clima} onChange={handleChange}>
              <option value="">Selecione</option>
              {CLIMAS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="atividades">Atividades do dia *</label>
            <textarea
              id="atividades"
              name="atividades"
              rows={4}
              placeholder="Uma atividade por linha. Ex: Concretagem da laje"
              value={form.atividades}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ocorrencias">Ocorrências</label>
            <textarea
              id="ocorrencias"
              name="ocorrencias"
              rows={3}
              placeholder="Uma ocorrência por linha. Ex: Chuva às 15h"
              value={form.ocorrencias}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoesGerais">Observações gerais</label>
            <textarea
              id="observacoesGerais"
              name="observacoesGerais"
              rows={3}
              value={form.observacoesGerais}
              onChange={handleChange}
            />
          </div>

          {error && <p className="erro-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button className="button-primary" type="submit" disabled={loading || loadingObras}>
            {loading ? "Salvando diário..." : "Salvar Diário"}
          </button>
        </form>

        <h3 style={{ marginTop: "var(--espacamento-xl)" }}>Últimos diários enviados</h3>
        {recentes.length === 0 ? (
          <div className="card" style={{ marginTop: "var(--espacamento-md)" }}>
            Nenhum diário encontrado.
          </div>
        ) : (
          recentes.map((d) => (
            <div key={d.id} className="card" style={{ marginTop: "var(--espacamento-sm)" }}>
              <strong>{new Date(d.data).toLocaleDateString("pt-BR")}</strong>
              <p style={{ marginTop: "6px" }}>
                <strong>Clima:</strong> {d.clima || "não informado"}
              </p>
              <p style={{ marginTop: "6px" }}>
                <strong>Atividades:</strong> {Array.isArray(d.atividades) ? d.atividades.length : 0} registro(s)
              </p>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
