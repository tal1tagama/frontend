import api from "./api";
import { extractApiData } from "./response";

export async function createPurchase(items, obraId = null) {
  const response = await api.post("/solicitacoes", {
    itens: items,
    prioridade: "media",
    ...(obraId ? { obra: Number(obraId) } : {}),
  });
  return extractApiData(response.data);
}

export async function listPurchases() {
  const response = await api.get("/solicitacoes");
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
