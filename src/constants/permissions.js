export const PERFIS = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  ENCARREGADO: "encarregado",
};

export const ROUTE_PERMISSIONS = {
  "/": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/profile": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/medicoes": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/medicoes-lista": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/solicitacoes": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/status-solicitacoes": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/upload": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
  "/relatorios": [PERFIS.ADMIN, PERFIS.SUPERVISOR, PERFIS.ENCARREGADO],
};

export function canAccessRoute(perfil, route) {
  if (!perfil) return false;
  const allowed = ROUTE_PERMISSIONS[route] || [];
  return allowed.includes(perfil);
}
