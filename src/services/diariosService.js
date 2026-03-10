import api from "./api";
import { extractApiData } from "./response";

export async function createDiario(payload) {
  const response = await api.post("/diarios", payload);
  return extractApiData(response.data);
}

export async function listMeusDiarios(params = {}) {
  const response = await api.get("/diarios/minhas", { params });
  const raw = response.data;
  return {
    data: raw?.data ?? [],
    pagination: raw?.meta ?? raw?.pagination ?? null,
  };
}
