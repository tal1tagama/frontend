import { useState } from "react";
import api from "../services/api";

function EnviarMedicao() {

  const [form, setForm] = useState({
    comprimento: "",
    largura: "",
    altura: "",
    observacoes: ""
  });

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/medicoes", {
        ...form,
        area,
        volume
      });

      alert("Medição enviada com sucesso!");

      setForm({
        comprimento: "",
        largura: "",
        altura: "",
        observacoes: ""
      });

    } catch (error) {
      alert("Erro ao enviar medição");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Enviar Medição</h2>

      <form onSubmit={handleSubmit}>

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

        <button type="submit">
          Enviar Medição
        </button>

      </form>

    </div>
  );
}

export default EnviarMedicao;