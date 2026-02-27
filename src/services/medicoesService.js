import api from "./api";
import { extractApiData } from "./response";

export async function createMedicao(payload) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const obraId = payload?.obra || currentUser?.obraAtual;

  if (!obraId) {
    throw new Error("Usuário sem obra atual definida. Atualize o perfil antes de enviar medição.");
  }

  const obraNumero = Number(obraId);
  if (!Number.isInteger(obraNumero) || obraNumero <= 0) {
    throw new Error("Obra atual inválida. Atualize o perfil antes de enviar medição.");
  }

  const area = Number(payload?.area || 0);
  const volume = Number(payload?.volume || 0);

  const body = {
    obra: obraNumero,
    data: new Date().toISOString(),
    observacoes: payload?.observacoes || "",
    status: "enviada",
    itens: [
      {
        descricao: "Medição geométrica",
        quantidade: area,
        unidade: "m²",
        valorUnitario: volume > 0 ? 1 : 0,
        valorTotal: volume > 0 ? volume : area,
        observacoes: payload?.observacoes || "",
        local: "",
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
  const response = await api.get("/measurements/minhas", { params });
  return extractApiData(response.data);
}

export async function listAllMedicoes(params = {}) {
  // Endpoint exclusivo para supervisores/admins — retorna todas as medições
  const response = await api.get("/measurements", { params });
  return extractApiData(response.data);
}

export async function listMedicoesByObra(obraId, params = {}) {
  const response = await api.get(`/measurements/obra/${obraId}`, { params });
  return extractApiData(response.data);
}

export async function aprovarMedicao(id) {
  const response = await api.post(`/measurements/${id}/aprovar`);
  return extractApiData(response.data);
}

export async function rejeitarMedicao(id) {
  const response = await api.post(`/measurements/${id}/rejeitar`);
  return extractApiData(response.data);
}
