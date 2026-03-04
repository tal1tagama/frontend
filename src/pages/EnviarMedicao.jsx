// src/pages/EnviarMedicao.jsx
// Nova Medição — disponível para encarregado, supervisor e admin.
// O select de obra carrega apenas as obras vinculadas ao usuário logado
// (o back-end já filtra por perfil: encarregado vê só suas obras).
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { createMedicao } from "../services/medicoesService";
import { uploadFile } from "../services/filesService";
import { listObras } from "../services/obrasService";
import { extractApiMessage } from "../services/response";
import { AREAS_MEDICAO, TIPOS_SERVICO } from "../constants/medicao";
import "../styles/pages.css";

function EnviarMedicao() {

  const [form, setForm] = useState({
    obra: "",
    area: "",          // nome do ambiente (quarto, sala, etc.)
    tipoServico: "",   // tipo de serviço realizado
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
  const [loadingObras, setLoadingObras] = useState(true);

  // ─── Carregar obras do usuário ao montar o componente ───────────────────────
  // O endpoint /obras retorna apenas as obras vinculadas ao perfil do usuário:
  // encarregados veem apenas suas obras; supervisores e admins veem todas.
  useEffect(() => {
    const loadObras = async () => {
      try {
        setLoadingObras(true);
        setError("");
        const data = await listObras({ page: 1, limit: 100 });
        const lista = Array.isArray(data) ? data : [];
        setObras(lista);
        // Se houver apenas uma obra vinculada, pré-seleciona automaticamente
        if (lista.length === 1) {
          setForm((prev) => ({ ...prev, obra: String(lista[0].id) }));
        }
      } catch {
        setObras([]);
        setError("Não foi possível carregar as obras. Verifique sua conexão.");
      } finally {
        setLoadingObras(false);
      }
    };
    loadObras();
  }, []);

  // ─── Cálculos automáticos de área e volume ──────────────────────────────────
  const comprimento = Number(form.comprimento) || 0;
  const largura = Number(form.largura) || 0;
  const altura = Number(form.altura) || 0;
  const areaCalculada = comprimento * largura;
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

  // ─── Envio do formulário ─────────────────────────────────────────────────────
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validações no cliente antes de chamar a API
    if (!form.obra) {
      setError("Selecione uma obra para registrar a medição.");
      return;
    }
    if (!form.area) {
      setError("Selecione a área (ambiente) da medição.");
      return;
    }
    if (!form.tipoServico) {
      setError("Selecione o tipo de serviço realizado.");
      return;
    }
    if (comprimento <= 0 || largura <= 0 || altura <= 0) {
      setError("Comprimento, largura e altura devem ser maiores que zero.");
      return;
    }

    try {
      setLoading(true);
      let anexoId = null;

      // Upload da foto antes de criar a medição, se houver
      if (foto) {
        const uploadRes = await uploadFile(foto, { tipo: "foto_obra" });
        anexoId = uploadRes?.id ? Number(uploadRes.id) : null;
      }

      // Criar medição no back-end, incluindo dimensões brutas e campos de área/serviço
      await createMedicao({
        obra: Number(form.obra),
        area: form.area,
        tipoServico: form.tipoServico,
        comprimento: Number(form.comprimento),
        largura: Number(form.largura),
        altura: Number(form.altura),
        areaCalculada,
        volume,
        observacoes: form.observacoes,
        ...(anexoId && { anexos: [anexoId] }),
      });

      setSuccess("Medição enviada com sucesso!");
      // Limpa o formulário, mas mantém a obra se só havia uma opção
      setForm({
        obra: obras.length === 1 ? String(obras[0].id) : "",
        area: "",
        tipoServico: "",
        comprimento: "",
        largura: "",
        altura: "",
        observacoes: "",
      });
      setFoto(null);
      setPreview(null);
    } catch (err) {
      setError("Erro ao enviar medição: " + extractApiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="page-container">
        <h2 className="page-title">Nova Medição</h2>
        <p style={{ fontSize: "var(--tamanho-fonte-grande)", color: "var(--cor-texto-secundario)", marginBottom: "var(--espacamento-xl)", lineHeight: "1.6" }}>
          Registre as dimensões e informações da medição realizada na obra.
          Os campos marcados com <strong>*</strong> são obrigatórios.
        </p>

        <form onSubmit={handleSubmit} className="form-container">

          {/* ─── Seleção de Obra ─────────────────────────────────────────────
              O back-end filtra automaticamente conforme o perfil do usuário:
              encarregados veem apenas as obras às quais estão vinculados. */}
          <div className="form-group">
            <label htmlFor="obra">Obra *</label>
            {loadingObras ? (
              <select id="obra" disabled>
                <option>Carregando obras...</option>
              </select>
            ) : obras.length === 0 ? (
              <p className="erro-msg" style={{ marginTop: "4px" }}>
                Nenhuma obra disponível. Entre em contato com o administrador.
              </p>
            ) : (
              <select
                id="obra"
                name="obra"
                value={form.obra}
                onChange={handleChange}
                required
              >
                {/* Exibe opção vazia somente quando há múltiplas obras */}
                {obras.length > 1 && (
                  <option value="">Selecione a obra</option>
                )}
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nome || `Obra #${obra.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ─── Área da Medição (novo campo) ────────────────────────────────
              Identifica qual ambiente/cômodo da obra está sendo medido. */}
          <div className="form-group">
            <label htmlFor="area">Área da Medição *</label>
            <select
              id="area"
              name="area"
              value={form.area}
              onChange={handleChange}
              required
            >
              <option value="">Selecione a área</option>
              {AREAS_MEDICAO.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* ─── Tipo de Serviço (novo campo) ────────────────────────────────
              Descreve o tipo de serviço executado que gerou a medição. */}
          <div className="form-group">
            <label htmlFor="tipoServico">Tipo de Serviço *</label>
            <select
              id="tipoServico"
              name="tipoServico"
              value={form.tipoServico}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o tipo de serviço</option>
              {TIPOS_SERVICO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* ─── Dimensões ──────────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="comprimento">Comprimento (metros) *</label>
            <input
              id="comprimento"
              type="number"
              step="0.01"
              min="0.01"
              name="comprimento"
              placeholder="Ex: 10,50"
              value={form.comprimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="largura">Largura (metros) *</label>
            <input
              id="largura"
              type="number"
              step="0.01"
              min="0.01"
              name="largura"
              placeholder="Ex: 8,00"
              value={form.largura}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="altura">Altura (metros) *</label>
            <input
              id="altura"
              type="number"
              step="0.01"
              min="0.01"
              name="altura"
              placeholder="Ex: 3,00"
              value={form.altura}
              onChange={handleChange}
              required
            />
          </div>

          {/* ─── Cálculos Automáticos ──────────────────────────────────────── */}
          {(comprimento > 0 || largura > 0 || altura > 0) && (
            <div className="summary" style={{ marginBottom: "var(--espacamento-lg)" }}>
              <h3>Cálculos Automáticos</h3>
              <p><strong>Área calculada:</strong> {areaCalculada.toFixed(2)} m²</p>
              <p><strong>Volume calculado:</strong> {volume.toFixed(2)} m³</p>
            </div>
          )}

          {/* ─── Observações ────────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="observacoes">Observações (opcional)</label>
            <textarea
              id="observacoes"
              name="observacoes"
              placeholder="Adicione informações extras sobre a medição, condições encontradas, etc."
              value={form.observacoes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {/* ─── Foto da Medição ─────────────────────────────────────────────── */}
          <div className="form-group">
            <label htmlFor="foto">Foto da Medição (opcional)</label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="file-input"
            />
            {preview && (
              <div style={{ marginTop: "var(--espacamento-sm)" }}>
                <img
                  src={preview}
                  alt="Pré-visualização da foto selecionada"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "220px",
                    borderRadius: "var(--borda-radius)",
                    border: "2px solid var(--cor-borda)",
                  }}
                />
              </div>
            )}
          </div>

          {error && <p className="erro-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button
            type="submit"
            className="button-primary"
            disabled={loading || loadingObras || obras.length === 0}
          >
            {loading ? "Enviando medição..." : "Enviar Medição"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EnviarMedicao;
