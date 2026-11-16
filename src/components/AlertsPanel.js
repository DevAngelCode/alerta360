import Badge from "./Badge";

function diasRestantes(fechaLimite) {
  const [y, m, d] = String(fechaLimite).slice(0, 10).split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function Item({ s, type }) {
  const d = diasRestantes(s.fechaLimite || s.fecha_limite);
  const label = d < 0 ? `${Math.abs(d)} día(s) de retraso` : d === 0 ? "Vence hoy" : `${d} día(s) restantes`;
  const box = {
    vencida: "border-red-200 bg-red-50/60",
    proxima: "border-amber-200 bg-amber-50/60",
    riesgo: "border-sky-200 bg-sky-50/60",
  }[type];
  const accent = {
    vencida: "text-red-700",
    proxima: "text-amber-700",
    riesgo: "text-sky-700",
  }[type];

  return (
    <li className={`rounded-lg border p-3 ${box}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">#{s.id} · {s.empresa || s.empresa_nombre}</p>
          <p className="text-xs text-slate-600">{s.titulo}</p>
        </div>
        <span className={`text-xs font-semibold ${accent}`}>{label}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
        <span>Responsable: <span className="font-medium text-slate-800">{s.responsable || s.responsable_nombre}</span></span>
        <span>Fecha límite: <span className="font-medium text-slate-800">{String(s.fechaLimite || s.fecha_limite).slice(0, 10)}</span></span>
      </div>
      <div className="mt-2"><Badge type="prioridad" value={s.prioridad} /></div>
    </li>
  );
}

function Section({ title, items, type, emptyText }) {
  const colors = { vencida: "text-red-700", proxima: "text-amber-700", riesgo: "text-sky-700" };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold ${colors[type]}`}>{title}</h3>
        <span className="text-xs text-slate-500">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((s) => <Item key={s.id} s={s} type={type} />)}
        </ul>
      )}
    </div>
  );
}

export default function AlertsPanel({ vencidas = [], proximas = [], enRiesgo = [], compact = false }) {
  const total = vencidas.length + proximas.length + enRiesgo.length;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Alertas</h2>
        <span className="text-xs font-medium text-slate-500">{total} activas</span>
      </div>
      {total === 0 ? (
        <p className="text-sm text-slate-500">No hay alertas activas en este momento.</p>
      ) : (
        <>
          <Section title="Solicitudes vencidas" items={compact ? vencidas.slice(0, 2) : vencidas} type="vencida" emptyText="Sin solicitudes vencidas." />
          <Section title="Próximas a vencer" items={compact ? proximas.slice(0, 2) : proximas} type="proxima" emptyText="Sin solicitudes próximas a vencer." />
          <Section title="Solicitudes en riesgo" items={compact ? enRiesgo.slice(0, 2) : enRiesgo} type="riesgo" emptyText="Sin solicitudes en riesgo." />
        </>
      )}
    </div>
  );
}
