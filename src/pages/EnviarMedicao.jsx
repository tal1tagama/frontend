import { useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import "../styles/pages.css";

function EnviarMedicao() {

  const [form, setForm] = useState({
    comprimento: "",
    largura: "",
    altura: "",
    observacoes: ""
  });

  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

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

    try {
      let fotoUrl = null;

      // 1. Se há foto, fazer upload primeiro via /files/upload
      if (foto) {
        const uploadData = new FormData();
        uploadData.append("file", foto);
        uploadData.append("tipo", "fotos");

        const uploadRes = await api.post("/files/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        // O backend retorna { data: { url: "/uploads/fotos/..." } }
        fotoUrl = uploadRes.data?.data?.url || uploadRes.data?.url || null;
      }

      // 2. Enviar medição como JSON com a URL da foto (texto)
      await api.post("/medicoes", {
        comprimento: form.comprimento,
        largura: form.largura,
        altura: form.altura,
        observacoes: form.observacoes,
        area,
        volume,
        ...(fotoUrl && { foto: fotoUrl })
      });

      alert("Medição enviada com sucesso!");

      setForm({
        comprimento: "",
        largura: "",
        altura: "",
        observacoes: ""
      });
      setFoto(null);
      setPreview(null);

    } catch (error) {
      alert("Erro ao enviar medição: " + (error.response?.data?.message || error.message));
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Enviar Medição</h2>

        <form onSubmit={handleSubmit} className="form-container">

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

        <button type="submit" className="button-primary">
          Enviar Medição
        </button>

      </form>

      </div>
    </Layout>
  );
}

export default EnviarMedicao;