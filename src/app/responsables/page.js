"use client";

import { useEffect, useState, useCallback } from "react";
import Toast from "@/components/Toast";

const empty = { nombre: "", correo: "", empresa_id: "" };

export default function ResponsablesPage() {
  const [items, setItems] = useState([]);
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
      const [rRes, eRes] = await Promise.all([fetch("/api/responsables"), fetch("/api/empresas")]);
      const rJson = await rRes.json();
      const eJson = await eRes.json();
      if (!rJson.ok) throw new Error(rJson.error || "Error al cargar responsables.");
      if (!eJson.ok) throw new Error(eJson.error || "Error al cargar empresas.");
      setItems(rJson.data);
      setEmpresas(eJson.data);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(empty); setErrors({}); setShowForm(true); };
  const openEdit = (r) => { setEditing(r); setForm({ nombre: r.nombre || "", correo: r.correo || "", empresa_id: r.empresa_id ? String(r.empresa_id) : "" }); setErrors({}); setShowForm(true); };

  const validate = () => {
    const err = {};
    if (!form.nombre.trim()) err.nombre = "El nombre es obligatorio.";
    if (!form.correo.trim()) err.correo = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) err.correo = "Correo no válido.";
    if (!form.empresa_id) err.empresa_id = "La empresa es obligatoria.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const save = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      const payload = { ...form, empresa_id: Number(form.empresa_id) };
      const url = editing ? `/api/responsables/${editing.id}` : "/api/responsables";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al guardar.");
      notify(editing ? "Responsable actualizado correctamente." : "Responsable registrado correctamente.");
      setShowForm(false);
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`¿Eliminar a ${r.nombre}?`)) return;
    try {
      const res = await fetch(`/api/responsables/${r.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al eliminar.");
      notify("Responsable eliminado.");
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Responsables</h1>
          <p className="mt-1 text-sm text-slate-600">Personas responsables de la gestión de solicitudes.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Registrar responsable</button>
      </header>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">Cargando responsables...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-700">No hay responsables registrados</p>
          <p className="mt-1 text-xs text-slate-500">Registra un responsable para comenzar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Correo</th>
                <th className="px-4 py-3 font-semibold">Empresa</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{(r.nombre || "").split(" ").map((n) => n[0]).join("").slice(0,2)}</div>
                      <span className="font-medium text-slate-900">{r.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.correo}</td>
                  <td className="px-4 py-3 text-slate-700">{r.empresa_nombre || ""}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(r)} className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">Editar</button>
                      <button onClick={() => remove(r)} className="rounded-md px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50">Eliminar</button>
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
              <h2 className="text-lg font-semibold text-slate-900">{editing ? "Editar responsable" : "Registrar responsable"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={save} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nombre</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Correo</label>
                <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                {errors.correo && <p className="mt-1 text-xs text-red-600">{errors.correo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Empresa</label>
                <select value={form.empresa_id} onChange={(e) => setForm({ ...form, empresa_id: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:o
