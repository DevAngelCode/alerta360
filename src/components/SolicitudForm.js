"use client";

import { useState } from "react";

const empty = {
  titulo: "",
  descripcion: "",
  empresa: "",
  departamento: "",
  responsable: "",
  prioridad: "Media",
  estado: "Pendiente",
  fechaLimite: "",
};

export default function SolicitudForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || empty);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio.";
    if (!form.descripcion.trim()) e.descripcion = "La descripción es obligatoria.";
    if (!form.empresa.trim()) e.empresa = "La empresa es obligatoria.";
    if (!form.departamento.trim()) e.departamento = "El departamento es obligatorio.";
    if (!form.responsable.trim()) e.responsable = "El responsable es obligatorio.";
    if (!form.fechaLimite) e.fechaLimite = "La fecha límite es obligatoria.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const field = (label, name, type = "text", extra = {}) => (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          {...extra}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {extra.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          {...extra}
        />
      )}
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900">
          {initialData ? "Editar solicitud" : "Registrar solicitud"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("Título", "titulo")}</div>
          <div className="sm:col-span-2">{field("Descripción", "descripcion", "textarea")}</div>
          {field("Empresa", "empresa")}
          {field("Departamento", "departamento")}
          {field("Responsable", "responsable")}
          {field("Fecha límite", "fechaLimite", "date")}
          {field("Prioridad", "prioridad", "select", { options: ["Alta", "Media", "Baja"] })}
          {field("Estado", "estado", "select", { options: ["Pendiente", "En progreso", "Completada"] })}
          <div className="sm:col-span-2 mt-2 flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
