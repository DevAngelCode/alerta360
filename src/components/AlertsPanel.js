import Badge from "./Badge";

function Section({ title, items, type }) {
  const styles = {
    vencida: "border-red-200 bg-red-50",
    proxima: "border-amber-200 bg-amber-50",
  };
  const titleStyles = {
    vencida: "text-red-800",
    proxima: "text-amber-800",
  };
  return (
    <div>
      <h3 className={`text-sm font-semibold ${titleStyles[type]}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">Sin alertas en esta categoría.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((a) => (
            <li key={a.id} className={`rounded-lg border p-3 ${styles[type]}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">{a.titulo}</p>
                <span className={`text-xs font-semibold ${type === "vencida" ? "text-red-700" : "text-amber-700"}`}>
                  {a.fechaLimite}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {a.empresa} · Responsable: <span className="font-medium">{a.responsable}</span>
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge type="prioridad" value={a.prioridad} />
                <span className={`text-xs font-medium ${type === "vencida" ? "text-red-700" : "text-amber-700"}`}>
                  {type === "vencida" ? "Vencida" : "Próxima a vencer"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AlertsPanel({ proximas = [], vencidas = [], compact = false }) {
  const empty = proximas.length === 0 && vencidas.length === 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold text-slate-900">Alertas</h2>
      {empty ? (
        <p className="text-sm text-slate-500">No hay alertas activas.</p>
      ) : (
        <>
          <Section title="Solicitudes vencidas" items={vencidas} type="vencida" />
          {!compact && <Section title="Solicitudes próximas a vencer" items={proximas} type="proxima" />}
          {compact && proximas.length > 0 && <Section title="Próximas a vencer" items={proximas.slice(0, 3)} type="proxima" />}
        </>
      )}
    </div>
  );
}
