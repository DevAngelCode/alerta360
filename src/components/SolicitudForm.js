"use client";

import { useEffect, useState } from "react";

const empty = {
  titulo: "",
  descripcion: "",
  empresa_id: "",
  departamento: "",
  responsable_id: "",
  prioridad: "MEDIA",
  estado: "PENDIENTE",
  fecha_limite: "",
};

export default function SolicitudForm({ initialData, onSave, onCancel, readOnly = false, empresas = [], responsables = [] }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        titulo: initialData.titulo || "",
        descripcion: initialData.descripcion || "",
        empresa_id: initialData.empresa_id ? String(initialData.empresa_id) : "",
        departamento: initialData.departamento || "",
        responsable_id: initialData.responsable_id ? String(initialData.responsable_id) : "",
        prioridad: initialData.prioridad || "MEDIA",
        estado: initialData.estado || "PENDIENTE",
        fecha_limite: (initialData.fecha_limite || initialData.fechaLimite || "").slice(0, 10),
      });
    } else {
      setForm(empty);
    }
  }, [initialData]);

  const filteredResp = form.empresa_id
    ? responsables.filter((r) => String(r.empresa_id) === String(form.empresa_id))
    : responsables;

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "El título es obligatorio.";
    if (!form.empresa_id) e.empresa_id = "La empresa es obligatoria.";
    if (!form.responsable_id) e.responsable_id = "El responsable es obligatorio.";
    if (!form.fecha_limite) e.fecha_limite = "La fecha límite es obligatoria.";
    if (!["BAJA", "MEDIA", "ALTA"].includes(form.prioridad)) e.prioridad = "Prioridad inválida.";
    if (!["PENDIENTE", "EN_PROCESO", "COMPLETADA"].includes(form.estado)) e.estado = "Estado inválido.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "empresa_id") next.responsable_id = "";
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnly) return onCancel();
    if (!validate()) return;
    onSave({
      ...form,
      empresa_id: Number(form.empresa_id),
      responsable_id: Number(form.responsable_id),
    });
  };

  const inputCls = "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-600";
  const label = (text, name) => <label className="block text-sm font-medium text-slate-700" htmlFor={name}>{text}</label>;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {readOnly ? "Detalle de solicitud" : initialData ? "Editar solicitud" : "Registrar solicitud"}
            </h2>
            <p className="text-sm text-slate-500">Complete la información requerida.</p>
          </div>
          <button onClick={onCancel} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Cerrar">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            {label("Título", "titulo")}
            <input id="titulo" name="titulo" value={form.titulo} onChange={handleChange} disabled={readOnly} className={inputCls} />
            {errors.titulo && <p className="mt-1 text-xs text-red-600">{errors.titulo}</p>}
          </div>
          <div className="sm:col-span-2">
            {label("Descripción", "descripcion")}
            <textarea id="descripcion" name="descripcion" rows={3} value={form.descripcion} onChange={handleChange} disabled={readOnly} className={inputCls} />
          </div>
          <div>
            {label("Empresa", "empresa_id")}
            <select id="empresa_id" name="empresa_id" value={form.empresa_id} onChange={handleChange} disabled={readOnly} className={inputCls}>
              <option value="">Seleccionar</option>
              {empresas.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
            {errors.empresa_id && <p className="mt-1 text-xs text-red-600">{errors.empresa_id}</p>}
          </div>
          <div>
            {label("Departamento", "departamento")}
            <input id="departamento" name="departamento" value={form.departamento} onChange={handleChange} disabled={readOnly} className={inputCls} />
          </div>
          <div>
            {label("Responsable", "responsable_id")}
            <select id="responsable_id" name="responsable_id" value={form.responsable_id} onChange={handleChange} disabled={readOnly} className={inputCls}>
              <option value="">Seleccionar</option>
              {filteredResp.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            {errors.responsable_id && <p className="mt-1 text-xs text-red-600">{errors.responsable_id}</p>}
          </div>
          <div>
            {label("Fecha límite", "fecha_limite")}
            <input id="fecha_limite" type="date" name="fecha_limite" value={form.fecha_limite} onChange={handleChange} disabled={readOnly} className={inputCls} />
            {errors.fecha_limite && <p className="mt-1 text-xs text-red-600">{errors.fecha_limite}</p>}
          </div>
          <div>
            {label("Prioridad", "prioridad")}
            <select id="prioridad" name="prioridad" value={form.prioridad} onChange={handleChange} disabled={readOnly} className={inputCls}>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>
          <div>
            {label("Estado", "estado")}
            <select id="estado" name="estado" value={form.estado} onChange={handleChange} disabled={readOnly} className={inputCls}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="COMPLETADA">Completada</option>
            </select>
          </div>
          <div className="sm:col-span-2 mt-2 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {readOnly ? "Cerrar" : "Cancelar"}
            </button>
            {!readOnly && (
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
