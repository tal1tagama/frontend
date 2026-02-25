import api from "./api";

export async function createMedicao(payload) {
  const response = await api.post("/medicoes", payload);
  return response.data;
}

export async function listMedicoes(params = {}) {
  const response = await api.get("/medicoes", { params });
  return response.data;
}
