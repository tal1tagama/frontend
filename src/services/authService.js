import api from "./api";

export async function markNotificationsRead() {
  const response = await api.post("/auth/notifications/read");
  return response?.data?.data || { total: 0 };
}
