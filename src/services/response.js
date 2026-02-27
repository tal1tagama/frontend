export function extractApiData(payload) {
  if (!payload) return null;
  if (payload.success && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }
  return payload.data ?? payload;
}

export function extractApiList(payload) {
  const data = extractApiData(payload);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

export function extractApiMessage(error, fallback = "Erro inesperado") {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}
