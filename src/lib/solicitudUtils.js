export function formatFecha(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}
export function estadoLabel(v) {
  const m = { PENDIENTE: "Pendiente", EN_PROCESO: "En proceso", COMPLETADA: "Completada" };
  return m[v] || v || "";
}
export function prioridadLabel(v) {
  const m = { BAJA: "Baja", MEDIA: "Media", ALTA: "Alta" };
  return m[v] || v || "";
}
