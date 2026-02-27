import { useState } from "react";
import { useEffect } from "react";
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
    observacoes: ""
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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (comprimento <= 0 || largura <= 0 || altura <= 0) {
      setError("Comprimento, largura e altura devem ser maiores que zero.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const obraSelecionada = Number(form.obra || currentUser?.obraAtual || 0);
    if (!Number.isInteger(obraSelecionada) || obraSelecionada <= 0) {
      setError("Selecione uma obra válida para enviar a medição.");
      return;
    }

    try {
      setLoading(true);
      let anexoId = null;

      // 1. Se há foto, fazer upload primeiro via /files/upload
      if (foto) {
        const uploadRes = await uploadFile(foto, { tipo: "foto_obra" });
        anexoId = uploadRes?.id ? Number(uploadRes.id) : null;
      }

      // 2. Enviar medição como JSON com a URL da foto (texto)
      await createMedicao({
        obra: obraSelecionada,
        comprimento: form.comprimento,
        largura: form.largura,
        altura: form.altura,
        observacoes: form.observacoes,
        area,
        volume,
        ...(anexoId && { anexos: [anexoId] })
      });

      setSuccess("Medicao enviada com sucesso!");

      setForm({
        obra: "",
        comprimento: "",
        largura: "",
        altura: "",
        observacoes: ""
      });
      setFoto(null);
      setPreview(null);

    } catch (error) {
      setError("Erro ao enviar medicao: " + extractApiMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Enviar Medição</h2>

        <form onSubmit={handleSubmit} className="form-container">

        <div>
          <label>Obra</label>
          <br />
          <select
            name="obra"
            value={form.obra}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma obra</option>
            {obras.map((obra) => (
              <option key={obra.id} value={obra.id}>
                {obra.nome || `Obra #${obra.id}`}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Comprimento (m)</label>
          <br />
          <input
            type="number"
            step="0.01"
            name="comprimento"
            value={form.comprimento}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Largura (m)</label>
          <br />
          <input
            type="number"
            step="0.01"
            name="largura"
            value={form.largura}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Altura (m)</label>
          <br />
          <input
            type="number"
            step="0.01"
            name="altura"
            value={form.altura}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Área (m²)</label>
          <br />
          <input
            type="number"
            value={area.toFixed(2)}
            readOnly
          />
        </div>

        <br />

        <div>
          <label>Volume (m³)</label>
          <br />
          <input
            type="number"
            value={volume.toFixed(2)}
            readOnly
          />
        </div>

        <br />

        <div>
          <label>Observações</label>
          <br />
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <br />

        <div>
          <label>Foto da Medição (opcional)</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="file-input"
          />
          {preview && (
            <div className="foto-preview">
              <img src={preview} alt="Preview da foto" width="200" />
            </div>
          )}
        </div>

        <br />

        {error && <p className="erro-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Medicao"}
        </button>

      </form>

      </div>
    </Layout>
  );
}

export default EnviarMedicao;