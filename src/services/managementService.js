import api from "./api";

export async function getManagementOverview(periodo = 30) {
  const response = await api.get("/management/overview", { params: { periodo } });
  return response?.data?.data || { resumoGeral: {}, obras: [], alertas: [] };
}

function triggerBlobDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadManagementCsv(periodo = 30) {
  const response = await api.get("/management/exports/obras.csv", {
    params: { periodo },
    responseType: "blob",
  });
  triggerBlobDownload(response.data, `painel-gerencial-obras-${new Date().toISOString().slice(0, 10)}.csv`);
}

export async function downloadMedicoesCsv({ obraId, mes } = {}) {
  const response = await api.get("/management/exports/medicoes.csv", {
    params: { obraId, mes },
    responseType: "blob",
  });
  triggerBlobDownload(response.data, `boletim-medicoes-${mes || "geral"}.csv`);
}

export async function downloadBoletimPdf({ obraId, mes } = {}) {
  const response = await api.get("/management/exports/boletim.pdf", {
    params: { obraId, mes },
    responseType: "blob",
  });
  triggerBlobDownload(response.data, `boletim-medicoes-${mes || "geral"}.pdf`);
}
