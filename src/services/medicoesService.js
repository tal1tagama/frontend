import api from "./api";
import { extractApiData } from "./response";

export async function createMedicao(payload) {
  const obraId = payload?.obra;

  if (!obraId) {
    throw new Error("Obra não selecionada. Selecione uma obra antes de enviar a medição.");
  }

  const obraNumero = Number(obraId);
  if (!Number.isInteger(obraNumero) || obraNumero <= 0) {
    throw new Error("Obra inválida. Selecione uma obra válida antes de enviar a medição.");
  }

  // Dimensões brutas — preservadas individualmente no banco
  const comprimento = Number(payload?.comprimento) || null;
  const largura     = Number(payload?.largura)     || null;
  const altura      = Number(payload?.altura)      || null;

  // Valores geométricos calculados (podem vir pré-calculados do componente ou calculados aqui)
  const areaCalculada = (comprimento && largura) ? comprimento * largura : (Number(payload?.areaCalculada) || 0);
  const volume        = (comprimento && largura && altura) ? comprimento * largura * altura : (Number(payload?.volume) || 0);

  // Nome do ambiente (quarto, sala, etc.) — campo "area" da entidade Medição no back-end
  const areaNome   = payload?.area        || null;
  const tipoServico = payload?.tipoServico || null;

  const descricaoItem = areaNome
    ? `Medição geométrica — ${areaNome}`
    : "Medição geométrica";

  const body = {
    obra:         obraNumero,
    data:         new Date().toISOString(),
    area:         areaNome,
    tipoServico,
    observacoes:  payload?.observacoes || "",
    status:       payload?.status || "enviada",
    // Dimensões brutas — agora persistidas como colunas dedicadas no banco
    comprimento,
    largura,
    altura,
    areaCalculada: areaCalculada > 0 ? areaCalculada : null,
    volume:        volume > 0 ? volume : null,
    itens: [
      {
        descricao:    descricaoItem,
        quantidade:   areaCalculada > 0 ? areaCalculada : (comprimento || 0),
        unidade:      "m²",
        // volume é informação geométrica, não financeira — valorUnitario não se aplica
        valorUnitario: null,
        valorTotal:    volume > 0 ? volume : areaCalculada,
        observacoes:   payload?.observacoes || "",
        local:         areaNome || "",
      },
    ],
  };

  if (Array.isArray(payload?.anexos)) {
    const anexoIds = payload.anexos
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);

    if (anexoIds.length > 0) {
      body.anexos = anexoIds;
    }
  }

  const response = await api.post("/measurements", body);
  return extractApiData(response.data);
}

export async function listMedicoes(params = {}) {
  // Suporta filtros: page, limit, obra, status, tipoServico, area, dataInicio, dataFim
  // O back-end filtra as medições do próprio usuário logado.
  const response = await api.get("/measurements/minhas", { params });
  return extractApiData(response.data);
}

/**
 * Versão paginada de listMedicoes — retorna { data: [], pagination: {} }
 * para que os componentes possam exibir controles de navegação de página.
 */
export async function listMedicoesPaginado(params = {}) {
  const response = await api.get("/measurements/minhas", { params });
  const payload = response.data;
  return {
    data:       payload?.data  ?? [],
    pagination: payload?.pagination ?? null,
  };
}

export async function listAllMedicoes(params = {}) {
  // Endpoint exclusivo para supervisores/admins — retorna todas as medições.
  // Suporta filtros: page, limit, obra, status, responsavel, dataInicio, dataFim, area, tipoServico
  const response = await api.get("/measurements", { params });
  return extractApiData(response.data);
}

/**
 * Versão paginada de listAllMedicoes — retorna { data: [], pagination: {} }
 */
export async function listAllMedicoesPaginado(params = {}) {
  const response = await api.get("/measurements", { params });
  const payload = response.data;
  return {
    data:       payload?.data  ?? [],
    pagination: payload?.pagination ?? null,
  };
}

export async function listMedicoesByObra(obraId, params = {}) {
  const response = await api.get(`/measurements/obra/${obraId}`, { params });
  return extractApiData(response.data);
}

export async function aprovarMedicao(id) {
  const response = await api.post(`/measurements/${id}/aprovar`);
  return extractApiData(response.data);
}

export async function rejeitarMedicao(id, motivoRejeicao = "") {
  const response = await api.post(`/measurements/${id}/rejeitar`, {
    motivoRejeicao,
  });
  return extractApiData(response.data);
}
