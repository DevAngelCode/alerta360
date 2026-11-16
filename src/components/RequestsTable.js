import Badge from "./Badge";

export default function RequestsTable({ items, compact = false, onEdit, onDelete, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Cargando solicitudes...
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        No hay solicitudes para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Título / Empresa</th>
            {!compact && <th className="px-4 py-3 font-semibold">Responsable</th>}
            {!compact && <th className="px-4 py-3 font-semibold">Departamento</th>}
            <th className="px-4 py-3 font-semibold">Fecha límite</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
            <th className="px-4 py-3 font-semibold">Prioridad</th>
            {!compact && (onEdit || onDelete) && <th className="px-4 py-3 font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">{s.id}</td>
              <td className="px-4 py-3 text-slate-700">
                <div className="font-medium text-slate-900">{s.titulo}</div>
                <div className="text-xs text-slate-500">{s.empresa}</div>
              </td>
              {!compact && <td className="px-4 py-3 text-slate-700">{s.responsable}</td>}
              {!compact && <td className="px-4 py-3 text-slate-700">{s.departamento}</td>}
              <td className="px-4 py-3 text-slate-700">{s.fechaLimite}</td>
              <td className="px-4 py-3"><Badge type="estado" value={s.estado} /></td>
              <td className="px-4 py-3"><Badge type="prioridad" value={s.prioridad} /></td>
              {!compact && (onEdit || onDelete) && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(s)} className="rounded-md border border-sky-200 px-2.5 py-1 text-xs font-medium text-sky-700 hover:bg-sky-50">
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(s)} className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                        Eliminar
                      </button>
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
