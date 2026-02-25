import api from "./api";

export async function createPurchase(items) {
  const response = await api.post("/purchases", { items });
  return response.data;
}

export async function listPurchases() {
  const response = await api.get("/purchases");
  return response.data;
}
