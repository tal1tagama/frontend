import api from "./api";
import { extractApiData, extractApiList } from "./response";

export async function listObras(params = {}) {
  const response = await api.get("/obras", { params });
  const payload = extractApiData(response.data);

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;

  return extractApiList(response.data);
}
