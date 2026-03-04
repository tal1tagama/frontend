// src/services/usersService.js
// Serviço para operações relacionadas a usuários.
// Usado principalmente pelo admin para listar usuários ao gerenciar encarregados de obras.
import api from "./api";
import { extractApiData } from "./response";

/**
 * Lista todos os usuários do sistema.
 * Apenas admin e supervisor têm acesso a este endpoint.
 *
 * @param {object} params - Filtros opcionais
 * @param {string} [params.perfil] - Filtra por perfil: admin | supervisor | encarregado
 * @param {number} [params.page]   - Página (default 1)
 * @param {number} [params.limit]  - Itens por página (default 100)
 * @returns {Array} Lista de usuários com id, nome, email, perfil
 */
export async function listUsers(params = {}) {
  const response = await api.get("/auth/users", { params });
  const payload = extractApiData(response.data);
  return Array.isArray(payload) ? payload : [];
}
