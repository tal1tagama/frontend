import { openDB } from "idb";

function createSyncId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function getSyncDb() {
  return openDB("offline-sync", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("operations")) {
        const store = db.createObjectStore("operations", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    },
  });
}

export async function enqueueSyncOperation(type, payload) {
  const db = await getSyncDb();

  const syncId = payload?.syncId || createSyncId();
  const clientTimestamp = payload?.clientTimestamp || new Date().toISOString();

  await db.add("operations", {
    type,
    status: "pending",
    payload: {
      ...payload,
      syncId,
      clientTimestamp,
      sincronizado: false,
    },
    createdAt: new Date().toISOString(),
  });

  return { syncId, clientTimestamp };
}

export async function getPendingSyncOperations() {
  const db = await getSyncDb();
  return db.getAllFromIndex("operations", "status", "pending");
}

export async function getConflictSyncOperations() {
  const db = await getSyncDb();
  return db.getAllFromIndex("operations", "status", "conflict");
}

export async function markSyncOperationConflict(id) {
  const db = await getSyncDb();
  const item = await db.get("operations", id);
  if (!item) return;
  item.status = "conflict";
  item.updatedAt = new Date().toISOString();
  await db.put("operations", item);
}

export async function removeSyncOperation(id) {
  const db = await getSyncDb();
  await db.delete("operations", id);
}

export async function markSyncOperationPending(id) {
  const db = await getSyncDb();
  const item = await db.get("operations", id);
  if (!item) return;
  item.status = "pending";
  item.updatedAt = new Date().toISOString();
  await db.put("operations", item);
}

export async function countPendingSyncOperations() {
  const items = await getPendingSyncOperations();
  return items.length;
}

export async function countConflictSyncOperations() {
  const items = await getConflictSyncOperations();
  return items.length;
}
