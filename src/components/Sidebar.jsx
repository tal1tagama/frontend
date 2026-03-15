import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { canAccessRoute, PERFIL_LABELS } from "../constants/permissions";
import Icon from "./Icons";
import "../styles/sidebar.css";

/**
 * Grupos de navegação agrupados por funcionalidade.
 * A visibilidade de cada item é controlada por canAccessRoute(perfil, path).
 */
const NAV_GROUPS = [
  {
    label: "Início",
    items: [
      { path: "/",           label: "Dashboard",    iconKey: "home" },
    ],
  },
  {
    label: "Medições",
    items: [
      { path: "/medicoes",       label: "Nova Medição",      iconKey: "ruler"     },
      { path: "/medicoes-lista", label: "Lista de Medições", iconKey: "checklist" },
    ],
  },
  {
    label: "Obra",
    items: [
      { path: "/diario", label: "Diário de Obra",  iconKey: "clipboard" },
      { path: "/upload",  label: "Enviar Arquivos", iconKey: "upload"    },
    ],
  },
  {
    label: "Solicitações",
    items: [
      { path: "/solicitacoes",        label: "Solicitar Materiais", iconKey: "cart"      },
      { path: "/status-solicitacoes", label: "Minhas Solicitações", iconKey: "checklist" },
    ],
  },
  {
    label: "Sincronização",
    items: [
      { path: "/sincronizacao", label: "Sincronização Offline", iconKey: "sync" },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { path: "/relatorios", label: "Relatórios", iconKey: "chart" },
    ],
  },
  {
    label: "Administração",
    items: [
      { path: "/obras",    label: "Obras",                 iconKey: "building"   },
      { path: "/register", label: "Cadastrar Funcionário", iconKey: "person-add" },
      { path: "/admin",    label: "Administração",         iconKey: "settings"   },
    ],
  },
  {
    label: "Conta",
    items: [
      { path: "/profile", label: "Meu Perfil", iconKey: "person" },
    ],
  },
];

/**
 * Sidebar — menu lateral retrátil.
 *
 * Props:
 *   collapsed     {boolean}  — sidebar recolhida (apenas ícones) no desktop
 *   onToggle      {function} — alterna colapso
 *   mobileOpen    {boolean}  — sidebar visível como overlay no mobile
 *   onMobileClose {function} — fecha o overlay no mobile
 */
function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const perfil = user?.perfil || null;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function handleNavClick(path) {
    navigate(path);
    if (onMobileClose) onMobileClose();
  }

  // Remove grupos cujos itens o perfil não pode acessar
  const visibleGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(({ path }) => canAccessRoute(perfil, path)),
  })).filter((group) => group.items.length > 0);

  const sidebarClass = [
    "sidebar",
    collapsed    ? "sidebar--collapsed"    : "",
    mobileOpen   ? "sidebar--mobile-open"  : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {/* Overlay escuro para fechar sidebar no mobile */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside className={sidebarClass} aria-label="Menu de navegação">

        {/* ── Cabeçalho: logo + botão de colapsar ─────────────────────── */}
        <div className="sidebar-header">
          {!collapsed && (
            <div className="sidebar-logo-wrap">
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt=""
                className="sidebar-logo-img"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span className="sidebar-logo-text">ObraLink</span>
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <SvgMenuToggle />
          </button>
        </div>

        {/* ── Navegação principal agrupada ────────────────────────────── */}
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {visibleGroups.map((group) => (
            <div key={group.label} className="sidebar-group">
              {!collapsed && (
                <span className="sidebar-group-label" aria-hidden="true">
                  {group.label}
                </span>
              )}
              {group.items.map(({ path, label, iconKey }) => (
                <button
                  key={path}
                  className={`sidebar-item${isActive(path) ? " sidebar-item--active" : ""}`}
                  onClick={() => handleNavClick(path)}
                  title={collapsed ? label : undefined}
                  aria-label={label}
                  aria-current={isActive(path) ? "page" : undefined}
                >
                  <span className="sidebar-item-icon">
                    <Icon name={iconKey} size={19} />
                  </span>
                  {!collapsed && (
                    <span className="sidebar-item-label">{label}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Rodapé: usuário logado + botão sair ─────────────────────── */}
        <div className="sidebar-footer">
          {!collapsed && user && (
            <div className="sidebar-user">
              <span className="sidebar-user-name">
                {user.nome || user.email || "Usuário"}
              </span>
              <span className="sidebar-user-role">
                {PERFIL_LABELS[perfil] || perfil || "Usuário"}
              </span>
            </div>
          )}
          <button
            className="sidebar-item sidebar-item--logout"
            onClick={handleLogout}
            title={collapsed ? "Sair do sistema" : undefined}
            aria-label="Sair do sistema"
          >
            <span className="sidebar-item-icon">
              <Icon name="logout" size={19} />
            </span>
            {!collapsed && (
              <span className="sidebar-item-label">Sair</span>
            )}
          </button>
        </div>

      </aside>
    </>
  );
}

/** Ícone de hambúrguer para o botão de toggle */
function SvgMenuToggle() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default Sidebar;
