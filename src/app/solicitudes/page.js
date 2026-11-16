"use client";

import { useEffect, useMemo, useState } from "react";
import RequestsTable from "@/components/RequestsTable";
import SolicitudForm from "@/components/SolicitudForm";
import Toast from "@/components/Toast";
import { initialSolicitudes } from "@/data/mockData";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterPrioridad, setFilterPrioridad] = useState("Todas");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSolicitudes(initialSolicitudes);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return solicitudes.filter((s) => {
      const matchQ =
        !q ||
        s.titulo.toLowerCase().includes(q) ||
        s.empresa.toLowerCase().includes(q) ||
        s.responsable.toLowerCase().includes(q);
      const matchE = filterEstado === "Todos" || s.estado === filterEstado;
      const matchP = filterPrioridad === "Todas" || s.prioridad === filterPrioridad;
      return matchQ && matchE && matchP;
    });
  }, [solicitudes, search, filterEstado, filterPrioridad]);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSave = (data) => {
    if (editing) {
      setSolicitudes((prev) => prev.map((s) => (s.id === editing.id ? { ...data, id: editing.id } : s)));
      notify("Solicitud actualizada correctamente.");
    } else {
      const id = `SOL-${1000 + Math.floor(Math.random() * 9000)}`;
      setSolicitudes((prev) => [{ ...data, id }, ...prev]);
      notify("Solicitud registrada correctamente.");
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleEdit = (s) => {
    setEditing(s);
    setShowForm(true);
  };

  const handleDelete = (s) => {
    if (window.confirm(`¿Eliminar la solicitud ${s.id}? Esta acción no se puede deshacer.`)) {
      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
      notify("Solicitud eliminada.", "success");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
          <p className="text-sm text-slate-600">Gestión de solicitudes registradas</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">
          + Registrar solicitud
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <input
          type="text"
          placeholder="Buscar por título, empresa o responsable..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:col-span-1"
        />
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
          <option value="Todos">Todos los estados</option>
          <option>Pendiente</option>
          <option>En progreso</option>
          <option>Completada</option>
        </select>
        <select value={filterPrioridad} onChange={(e) => setFilterPrioridad(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
          <option value="Todas">Todas las prioridades</option>
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>
      </div>

      <RequestsTable items={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {showForm && (
        <SolicitudForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
