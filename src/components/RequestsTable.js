import Badge from "./Badge";

export default function RequestsTable({ items, compact = false, onView, onEdit, onDelete, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
        Cargando solicitudes...
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-700">No hay solicitudes para mostrar</p>
        <p className="mt-1 text-xs text-slate-500">Ajusta los filtros o registra una nueva solicitud.</p>
      </div>
    );
  }

  const showActions = !compact && (onView || onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Código</th>
            <th className="px-4 py-3 font-semibold">Empresa / Título</th>
            <th className="px-4 py-3 font-semibold">Responsable</th>
            <th className="px-4 py-3 font-semibold">Fecha límite</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Prioridad</th>
            {showActions && <th className="px-4 py-3 font-semibold text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/70">
              <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">#{s.id}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{s.empresa || s.empresa_nombre}</div>
                <div className="text-xs text-slate-500">{s.titulo}</div>
              </td>
              <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{s.responsable || s.responsable_nombre}</td>
              <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{String(s.fechaLimite || s.fecha_limite || "").slice(0,10)}</td>
              <td className="px-4 py-3"><Badge type="estado" value={s.estado} /></td>
              <td className="px-4 py-3"><Badge type="prioridad" value={s.prioridad} /></td>
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <button onClick={() => onView(s)} className="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">Ver</button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(s)} className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">Editar</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(s)} className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">Eliminar</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
