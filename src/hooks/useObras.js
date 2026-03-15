import { useState, useEffect, useCallback } from "react";
import { listObras } from "../services/obrasService";

export default function useObras(limit = 100) {
  const [obras, setObras] = useState([]);
  const [loadingObras, setLoadingObras] = useState(true);

  const reload = useCallback(async () => {
    try {
      setLoadingObras(true);
      const data = await listObras({ page: 1, limit });
      const lista = Array.isArray(data) ? data : [];
      setObras(lista);
      return lista;
    } catch {
      setObras([]);
      return [];
    } finally {
      setLoadingObras(false);
    }
  }, [limit]);

  useEffect(() => { reload(); }, [reload]);

  return { obras, loadingObras, reload };
}
