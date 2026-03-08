import api from "./api";
import { extractApiData } from "./response";

export async function requestPasswordReset(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return extractApiData(response.data);
}

export async function resetPasswordWithCode({ email, codigo, novaSenha, confirmarSenha }) {
  const response = await api.post("/auth/reset-password", {
    email,
    codigo,
    novaSenha,
    confirmarSenha,
  });

  return extractApiData(response.data);
}
