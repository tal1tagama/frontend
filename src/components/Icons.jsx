/**
 * Icons.jsx
 * Ícones SVG minimalistas para uso em todo o sistema.
 * Baseados no estilo Heroicons / Feather — traço limpo, profissional.
 */

function svgBase(size, children) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    focusable: "false",
    style: { display: "inline-block", verticalAlign: "middle", flexShrink: 0 },
  };
}

export const IconHome = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconRuler = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <rect x="2" y="13" width="20" height="8" rx="2" />
    <path d="M6 13V9" />
    <path d="M10 13v-3" />
    <path d="M14 13V9" />
    <path d="M18 13v-3" />
  </svg>
);

export const IconCart = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

export const IconClipboard = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

export const IconUpload = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const IconChecklist = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export const IconBarChart = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <rect x="2" y="14" width="4" height="8" />
    <rect x="9" y="8" width="4" height="14" />
    <rect x="16" y="4" width="4" height="18" />
  </svg>
);

export const IconBuilding = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <rect x="3" y="9" width="18" height="13" rx="1" />
    <path d="M8 22V9" />
    <path d="M16 22V9" />
    <path d="M3 14h18" />
    <path d="M8 6h8l2 3H6z" />
  </svg>
);

export const IconSettings = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const IconPersonAdd = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

export const IconPerson = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconLogout = ({ size = 18 }) => (
  <svg {...svgBase(size)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const ICON_MAP = {
  home:         IconHome,
  ruler:        IconRuler,
  cart:         IconCart,
  clipboard:    IconClipboard,
  upload:       IconUpload,
  checklist:    IconChecklist,
  chart:        IconBarChart,
  building:     IconBuilding,
  settings:     IconSettings,
  "person-add": IconPersonAdd,
  person:       IconPerson,
  logout:       IconLogout,
};

/** Renderiza um ícone por nome. Retorna null se o nome não existir. */
export default function Icon({ name, size = 18 }) {
  const Comp = ICON_MAP[name];
  if (!Comp) return null;
  return <Comp size={size} />;
}
