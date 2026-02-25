import api from "./api";

export async function uploadFile(file, extra = {}) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
