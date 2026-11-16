"use client";

import { useEffect, useState, useCallback } from "react";
import RequestsTable from "@/components/RequestsTable";
import SolicitudForm from "@/components/SolicitudForm";
import Toast from "@/components/Toast";

export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterEmpresa, setFilterEmpresa] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterPrioridad, setFilterPrioridad] = useState("");
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAll = useCallback(async (opts = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const q = opts.q ?? search;
      const fe = opts.empresa ?? filterEmpresa;
      const fs = opts.estado ?? filterEstado;
      const fp = opts.prioridad ?? filterPrioridad;
      if (q) params.set("q", q);
      if (fe) params.set("empresa_id", fe);
      if (fs) params.set("estado", fs);
      if (fp) params.set("prioridad", fp);
      const [sRes, eRes, rRes] = await Promise.all([
        fetch(`/api/solicitudes?${params.toString()}`),
        fetch("/api/empresas"),
        fetch("/api/responsables"),
      ]);
      const [sJson, eJson, rJson] = await Promise.all([sRes.json(), eRes.json(), rRes.json()]);
      if (!sJson.ok) throw new Error(sJson.error || "Error al cargar solicitudes.");
      if (!eJson.ok) throw new Error(eJson.error || "Error al cargar empresas.");
      if (!rJson.ok) throw new Error(rJson.error || "Error al cargar responsables.");
      setSolicitudes(sJson.data);
      setEmpresas(eJson.data);
      setResponsables(rJson.data);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, filterEmpresa, filterEstado, filterPrioridad]);

  useEffect(() => { loadAll(); }, []); // initial

  const applyFilters = () => loadAll({ q: search, empresa: filterEmpresa, estado: filterEstado, prioridad: filterPrioridad });

  const handleSave = async (data) => {
    try {
      const url = editing ? `/api/solicitudes/${editing.id}` : "/api/solicitudes";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al guardar.");
      notify(editing ? "Solicitud actualizada correctamente." : "Solicitud registrada correctamente.");
      setShowForm(false);
      setEditing(null);
      loadAll({ q: search, empresa: filterEmpresa, estado: filterEstado, prioridad: filterPrioridad });
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`¿Eliminar la solicitud #${s.id}? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/solicitudes/${s.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al eliminar.");
      notify("Solicitud eliminada correctamente.");
      loadAll({ q: search, empresa: filterEmpresa, estado: filterEstado, prioridad: filterPrioridad });
    } catch (e) {
      notify(e.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
          <p className="mt-1 text-sm text-slate-600">Gestión y seguimiento de solicitudes empresariales.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Registrar solicitud
        </button>
      </header>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <select value={filterEmpresa} onChange={(e) => setFilterEmpresa(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">Todas las empresas</option>
          {empresas.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="COMPLETADA">Completada</option>
        </select>
        <select value={filterPrioridad} onChange={(e) => setFilterPrioridad(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
          <option value="">Todas las prioridades</option>
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
        <button onClick={applyFilters} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">Aplicar filtros</button>
      </div>

      <RequestsTable
        items={solicitudes}
        loading={loading}
        onView={(s) => setViewing(s)}
        onEdit={(s) => { setEditing(s); setShowForm(true); }}
        onDelete={handleDelete}
      />

      {showForm && (
        <SolicitudForm
          initialData={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          empresas={empresas}
          responsables={responsables}
        />
      )}
      {viewing && (
        <SolicitudForm
          initialData={viewing}
          readOnly
          onSave={() => {}}
          onCancel={() => setViewing(null)}
          empresas={empresas}
          responsables={responsables}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
