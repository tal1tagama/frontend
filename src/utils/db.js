// src/utils/db.js
// Armazenamento local (IndexedDB) para arquivos pendentes de envio offline.
// Quando o dispositivo fica sem internet, os arquivos e seus metadados são
// salvos aqui. Ao reconectar, a sincronização automática os envia ao servidor.
import { openDB } from "idb";

// Versão 3: arquivo salvo como ArrayBuffer + nome/tipo para reconstrução segura.
// O objeto File não é serializável de forma confiável entre sessões em todos os browsers.
export async function getDB() {
  return openDB("offline-files", 3, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
      // v2 → v3: alteramos o schema para armazenar buffer em vez do File diretamente.
      // A store existente é mantida; registros antigos (v1/v2) são ignorados pelo filtro
      // de !f.buffer no getPendingFiles.
    },
  });
}

/**
 * Salva um arquivo localmente para envio posterior.
 * Converte o File em ArrayBuffer para garantir persistência entre sessões.
 *
 * @param {File} file        - arquivo selecionado pelo usuário
 * @param {object} metadata  - metadados do formulário (obra, tipoArquivo, descricao, etc.)
 */
export async function saveFileOffline(file, metadata = {}) {
  const db = await getDB();
  // Converte o File para ArrayBuffer (serializável e persistente no IndexedDB)
  const buffer = await file.arrayBuffer();
  await db.add("files", {
    buffer,                   // conteúdo binário do arquivo
    fileName: file.name,      // nome original do arquivo
    fileType: file.type,      // MIME type do arquivo
    fileSize: file.size,
    metadata,
    uploaded: false,
    savedAt: new Date().toISOString(),
  });
}

/**
 * Retorna todos os arquivos pendentes (não enviados) reconstruindo
 * o objeto File a partir do ArrayBuffer salvo.
 */
export async function getPendingFiles() {
  const db = await getDB();
  const all = await db.getAll("files");

  return all
    .filter((f) => !f.uploaded && f.buffer)          // ignora registros de versões antigas
    .map((f) => ({
      ...f,
      // Reconstrói o File a partir do ArrayBuffer preservado no IndexedDB
      file: new File([f.buffer], f.fileName || "arquivo", { type: f.fileType || "application/octet-stream" }),
    }));
}

/**
 * Marca um arquivo como enviado com sucesso.
 */
export async function markAsUploaded(id) {
  const db = await getDB();
  const record = await db.get("files", id);
  if (record) {
    record.uploaded = true;
    record.uploadedAt = new Date().toISOString();
    // Libera o buffer da memória após o upload bem-sucedido
    delete record.buffer;
    await db.put("files", record);
  }
}

/**
 * Remove um arquivo pendente do armazenamento local.
 */
export async function removeOfflineFile(id) {
  const db = await getDB();
  await db.delete("files", id);
}
