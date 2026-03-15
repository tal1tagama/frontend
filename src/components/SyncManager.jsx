import { useEffect } from "react";
import { syncPendingOperations } from "../services/syncService";

export default function SyncManager() {
  useEffect(() => {
    let running = false;

    const runSync = async () => {
      if (running || !navigator.onLine) return;
      running = true;
      try {
        const result = await syncPendingOperations();
        if ((result.synced + result.conflicts + result.errors) > 0) {
          window.dispatchEvent(
            new CustomEvent("sync:completed", {
              detail: result,
            }),
          );
        }
      } catch (err) {
        // Falhas de sincronização são não-bloqueantes para a UI.
      } finally {
        running = false;
      }
    };

    runSync();
    window.addEventListener("online", runSync);
    return () => window.removeEventListener("online", runSync);
  }, []);

  return null;
}
