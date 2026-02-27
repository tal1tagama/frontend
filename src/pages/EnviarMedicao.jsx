import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { createMedicao } from "../services/medicoesService";
import { uploadFile } from "../services/filesService";
import { listObras } from "../services/obrasService";
import { extractApiMessage } from "../services/response";
import "../styles/pages.css";

function EnviarMedicao() {
  const [form, setForm] = useState({
    obra: "",
    comprimento: "",
    largura: "",
    altura: "",
    observacoes: "",
  });

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [obras, setObras] = useState([]);

  useEffect(() => {
    const loadObras = async () => {
      try {
        const data = await listObras({ page: 1, limit: 100 });
        setObras(Array.isArray(data) ? data : []);
      } catch {
        setObras([]);
      }
    };
    loadObras();
  }, []);

  const comprimento = Number(form.comprimento) || 0;
  const largura = Number(form.largura) || 0;
  const altura = Number(form.altura) || 0;
  const area = comprimento * largura;
  const volume = comprimento * largura * altura;

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleFotoChange(event) {
    const file = event.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (comprimento <= 0 || largura <= 0 || altura <= 0) {
      setError("Comprimento, largura e altura devem ser maiores que zero.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const obraSelecionada = Number(form.obra || currentUser?.obraAtual || 0);
    if (!Number.isInteger(obraSelecionada) || obraSelecionada <= 0) {
      setError("Selecione uma obra valida para enviar a medicao.");
      return;
    }

    try {
      setLoading(true);
      let anexoId = null;

      if (foto) {
        const uploadRes = await uploadFile(foto, { tipo: "foto_obra" });
        anexoId = uploadRes?.id ? Number(uploadRes.id) : null;
      }

      await createMedicao({
        obra: obraSelecionada,
        comprimento: form.comprimento,
        largura: form.largura,
        altura: form.altura,
        observacoes: form.observacoes,
        area,
        volume,
        ...(anexoId && { anexos: [anexoId] }),
      });

      setSuccess("Medicao enviada com sucesso!");
      setForm({ obra: "", comprimento: "", largura: "", altura: "", observacoes: "" });
      setFoto(null);
      setPreview(null);
    } catch (err) {
      setError("Erro ao enviar medicao: " + extractApiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Enviar Medicao</h2>
        <p style={{ fontSize: "var(--tamanho-fonte-grande)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-xl)", lineHeight: "1.6" }}>
          Registre as dimensoes e informacoes da medicao realizada na obra.
        </p>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="obra">Selecione a Obra *</label>
            <select id="obra" name="obra" value={form.obra} onChange={handleChange} required>
              <option value="">Escolha uma obra</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.nome || `Obra #${obra.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comprimento">Comprimento (metros) *</label>
            <input id="comprimento" type="number" step="0.01" name="comprimento" placeholder="Ex: 10.5" value={form.comprimento} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="largura">Largura (metros) *</label>
            <input id="largura" type="number" step="0.01" name="largura" placeholder="Ex: 8.0" value={form.largura} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="altura">Altura (metros) *</label>
            <input id="altura" type="number" step="0.01" name="altura" placeholder="Ex: 3.0" value={form.altura} onChange={handleChange} required />
          </div>

          <div className="summary" style={{ marginBottom: "var(--espacamento-lg)" }}>
            <h3>Calculos Automaticos</h3>
            <p><strong>Area calculada:</strong> {area.toFixed(2)} m²</p>
            <p><strong>Volume calculado:</strong> {volume.toFixed(2)} m³</p>
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observacoes (opcional)</label>
            <textarea id="observacoes" name="observacoes" placeholder="Adicione informacoes extras sobre a medicao" value={form.observacoes} onChange={handleChange} rows="4" />
          </div>

          <div className="form-group">
            <label htmlFor="foto">Adicionar Foto (opcional)</label>
            <input id="foto" type="file" accept="image/*" onChange={handleFotoChange} className="file-input" />
            {preview && (
              <div className="foto-preview">
                <img src={preview} alt="Visualizacao da foto" width="200" />
              </div>
            )}
          </div>

          {error && <p className="erro-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Enviando medicao..." : "Enviar Medicao"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EnviarMedicao;
