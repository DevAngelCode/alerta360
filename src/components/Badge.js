const styles = {
  estado: {
    Pendiente: "bg-amber-100 text-amber-800",
    "En progreso": "bg-sky-100 text-sky-800",
    Completada: "bg-emerald-100 text-emerald-800",
  },
  prioridad: {
    Alta: "bg-red-100 text-red-700",
    Media: "bg-amber-100 text-amber-700",
    Baja: "bg-slate-100 text-slate-700",
  },
};

export default function Badge({ type = "estado", value }) {
  const cls = styles[type]?.[value] || "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  );
}
