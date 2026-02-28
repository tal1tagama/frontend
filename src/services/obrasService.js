import api from "./api";
import { extractApiData, extractApiList } from "./response";

function tryParseJson(value) {
  if (!value || typeof value !== "string") return value;
  try { return JSON.parse(value); } catch (_) { return value; }
}

function formatEndereco(endereco) {
  if (!endereco) return null;
  const obj = tryParseJson(endereco);
  if (typeof obj === "string") return obj;
  const parts = [
    obj.logradouro,
    obj.numero ? `nº ${obj.numero}` : null,
    obj.bairro,
    obj.cidade && obj.estado
      ? `${obj.cidade}/${obj.estado}`
      : obj.cidade || obj.estado || null,
    obj.cep ? `CEP ${obj.cep}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function parseObra(obra) {
  return {
    ...obra,
    endereco: formatEndereco(obra.endereco),
    orcamento: tryParseJson(obra.orcamento),
    equipe: tryParseJson(obra.equipe),
    metadata: tryParseJson(obra.metadata),
  };
}

export async function listObras(params = {}) {
  const response = await api.get("/obras", { params });
  const payload = extractApiData(response.data);

  let obras;
  if (Array.isArray(payload)) {
    obras = payload;
  } else if (Array.isArray(payload?.data)) {
    obras = payload.data;
  } else {
    obras = extractApiList(response.data);
  }

  return obras.map(parseObra);
}
