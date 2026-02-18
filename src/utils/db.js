import { openDB } from "idb";

// cria ou abre banco local
export async function getDB() {
  return openDB("offline-files", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

export async function saveFileOffline(file) {
  const db = await getDB();
  await db.add("files", { file, uploaded: false });
}

export async function getPendingFiles() {
  const db = await getDB();
  return await db.getAll("files");
}

export async function markAsUploaded(id) {
  const db = await getDB();
  const record = await db.get("files", id);
  record.uploaded = true;
  await db.put("files", record);
}
