/**
 * Normaliza um objeto de medição retornado pelo back-end
 * para um formato consistente usado nas telas measurements.jsx e MeusRelatorios.jsx.
 *
 * @param {object} m - medição bruta da API
 * @returns {object} medição normalizada
 */
export function normalizeMedicao(m) {
  const itens = Array.isArray(m.itens) ? m.itens : [];
  const firstItem = itens[0] || {};
  return {
    id:              m.id,
    obra:            m.obra         || m.obraId  || null,
    obraNome:        m.obraNome     || null,
    responsavel:     m.responsavel  || null,
    responsavelNome: m.responsavelNome || null,
    area:            m.area         ?? firstItem.quantidade,
    volume:          m.volume       ?? firstItem.valorTotal,
    tipoServico:     m.tipoServico  || null,
    observacoes:     m.observacoes  || firstItem.observacoes,
    status:          m.status       || "enviada",
    itens,
    anexos:          Array.isArray(m.anexos) ? m.anexos : [],
    foto:            m.foto || null,
    createdAt:       m.createdAt || null,
  };
}
