"use client";

import { useEffect, useState } from "react";
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

  const fetchSolicitudes = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.empresa_id) params.set("empresa_id", filters.empresa_id);
    if (filters.estado) params.set("estado", filters.estado);
    if (filters.prioridad) params.set("prioridad", filters.prioridad);
    const res = await fetch(`/api/solicitudes?${params.toString()}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "Error al cargar solicitudes.");
    return json.data;
  };

  const loadRefs = async () => {
    const [eRes, rRes] = await Promise.all([fetch("/api/empresas"), fetch("/api/responsables")]);
    const [eJson, rJson] = await Promise.all([eRes.json(), rRes.json()]);
    if (eJson.ok) setEmpresas(eJson.data);
    if (rJson.ok) setResponsables(rJson.data);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, eRes, rRes] = await Promise.all([
          fetchSolicitudes({}),
          fetch("/api/empresas"),
          fetch("/api/responsables"),
        ]);
        const [eJson, rJson] = await Promise.all([eRes.json(), rRes.json()]);
        if (!active) return;
        setSolicitudes(s);
        if (eJson.ok) setEmpresas(eJson.data);
        if (rJson.ok) setResponsables(rJson.data);
      } catch (e) {
        if (active) notify(e.message, "error");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const s = await fetchSolicitudes({ q: search, empresa_id: filterEmpresa, estado: filterEstado, prioridad: filterPrioridad });
      setSolicitudes(s);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const reloadCurrent = async () => {
    const s = await fetchSolicitudes({ q: search, empresa_id: filterEmpresa, estado: filterEstado, prioridad: filterPrioridad });
    setSolicitudes(s);
  };

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
      setLoading(true);
      await reloadCurrent();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`¿Eliminar la solicitud #${s.id}? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/solicitudes/${s.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al eliminar.");
      notify("Solicitud eliminada correctamente.");
      setLoading(true);
      await reloadCurrent();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
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
