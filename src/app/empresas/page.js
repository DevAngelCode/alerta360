"use client";

import { useEffect, useState, useCallback } from "react";
import Toast from "@/components/Toast";

const empty = { nombre: "", ruc: "" };

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/empresas");
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al cargar empresas.");
      setEmpresas(json.data);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(empty); setErrors({}); setShowForm(true); };
  const openEdit = (e) => { setEditing(e); setForm({ nombre: e.nombre || "", ruc: e.ruc || "" }); setErrors({}); setShowForm(true); };

  const validate = () => {
    const err = {};
    if (!form.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    if (!form.ruc.trim()) err.ruc = "El RUC es obligatorio.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const url = editing ? `/api/empresas/${editing.id}` : "/api/empresas";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al guardar.");
      notify(editing ? "Empresa actualizada correctamente." : "Empresa registrada correctamente.");
      setShowForm(false);
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const remove = async (e) => {
    if (!window.confirm(`¿Eliminar la empresa ${e.nombre}?`)) return;
    try {
      const res = await fetch(`/api/empresas/${e.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al eliminar.");
      notify("Empresa eliminada.");
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Empresas</h1>
          <p className="mt-1 text-sm text-slate-600">Empresas registradas en la plataforma.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Registrar empresa</button>
      </header>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">Cargando empresas...</div>
      ) : empresas.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">No hay empresas registradas</p>
          <p className="mt-1 text-xs text-slate-500">Registra una empresa para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">RUC</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empresas.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">{e.id}</td>
                  <td className="px-4 py-3 text-slate-900">{e.nombre}</td>
                  <td className="px-4 py-3 text-slate-700">{e.ruc}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(e)} className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">Editar</button>
                      <button onClick={() => remove(e)} className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-slate-900">{editing ? "Editar empresa" : "Registrar empresa"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={save} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">RUC</label>
                <input value={form.ruc} onChange={(e) => setForm({ ...form, ruc: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                {errors.ruc && <p className="mt-1 text-xs text-red-600">{errors.ruc}</p>}
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
