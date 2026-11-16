const estadoStyles = {
  PENDIENTE: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Pendiente: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  EN_PROCESO: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  "En proceso": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  COMPLETADA: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Completada: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

const prioridadStyles = {
  ALTA: "bg-red-50 text-red-700 ring-1 ring-red-200",
  Alta: "bg-red-50 text-red-700 ring-1 ring-red-200",
  MEDIA: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Media: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  BAJA: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  Baja: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

const estadoLabels = { PENDIENTE: "Pendiente", EN_PROCESO: "En proceso", COMPLETADA: "Completada" };
const prioridadLabels = { ALTA: "Alta", MEDIA: "Media", BAJA: "Baja" };

export default function Badge({ type = "estado", value }) {
  const label = type === "estado" ? (estadoLabels[value] || value) : (prioridadLabels[value] || value);
  const cls = type === "estado" ? (estadoStyles[value] || "bg-slate-100 text-slate-600 ring-1 ring-slate-200") : (prioridadStyles[value] || "bg-slate-100 text-slate-600 ring-1 ring-slate-200");
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}
