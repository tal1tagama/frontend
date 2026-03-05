import api from "./api";
import { extractApiData } from "./response";

/**
 * Cria uma solicitacao de compra.
 * @param {{ obra_id?: number, itens: string[], descricao?: string }} payload
 */
export async function createPurchase({ obra_id = null, itens = [], descricao = "", prioridade = "media" } = {}) {
  // Mapeia strings para o formato esperado pelo back-end
  const itensFormatados = itens.map((item) => ({
    descricao: typeof item === "string" ? item : (item.descricao || item.nome || String(item)),
    quantidade: 1,
    unidade: "un",
  }));

  const response = await api.post("/solicitacoes", {
    itens: itensFormatados,
    prioridade,
    justificativa: descricao || null,
    ...(obra_id ? { obra: Number(obra_id) } : {}),
  });
  return extractApiData(response.data);
}

/**
 * Lista solicitacoes com suporte a paginacao.
 * @param {{ page?: number, limit?: number, status?: string }} params
 */
export async function listPurchases(params = {}) {
  const response = await api.get("/solicitacoes", { params });
  return extractApiData(response.data);
}

export async function aprovarPurchase(id) {
  const response = await api.post(`/solicitacoes/${id}/aprovar`);
  return extractApiData(response.data);
}

export async function rejeitarPurchase(id, motivoRejeicao = "") {
  const response = await api.post(`/solicitacoes/${id}/rejeitar`, {
    motivoRejeicao,
  });
  return extractApiData(response.data);
}
