"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import RequestsTable from "@/components/RequestsTable";
import AlertsPanel from "@/components/AlertsPanel";
import SolicitudForm from "@/components/SolicitudForm";
import Toast from "@/components/Toast";

const defaultStats = [
  { label: "Total de solicitudes", value: 0, tone: "blue", desc: "Registradas en el sistema", icon: "total" },
  { label: "Pendientes", value: 0, tone: "amber", desc: "Por iniciar", icon: "pending" },
  { label: "En proceso", value: 0, tone: "sky", desc: "En gestión activa", icon: "process" },
  { label: "Completadas", value: 0, tone: "green", desc: "Cerradas con éxito", icon: "done" },
  { label: "Alertas activas", value: 0, tone: "red", desc: "Requieren atención", icon: "alert" },
];

export default function Home() {
  const [dash, setDash] = useState(null);
  const [alertas, setAlertas] = useState({ vencidas: [], proximas: [] });
  const [empresas, setEmpresas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, aRes, eRes, rRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/alertas"),
        fetch("/api/empresas"),
        fetch("/api/responsables"),
      ]);
      const [d, a, e, r] = await Promise.all([dRes.json(), aRes.json(), eRes.json(), rRes.json()]);
      if (!d.ok) throw new Error(d.error || "Error al cargar dashboard.");
      if (!a.ok) throw new Error(a.error || "Error al cargar alertas.");
      setDash(d.data);
      setAlertas(a.data);
      if (e.ok) setEmpresas(e.data);
      if (r.ok) setResponsables(r.data);
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    if (!dash) return defaultStats;
    return [
      { label: "Total de solicitudes", value: dash.total, tone: "blue", desc: "Registradas en el sistema", icon: "total" },
      { label: "Pendientes", value: dash.pendientes, tone: "amber", desc: "Por iniciar", icon: "pending" },
      { label: "En proceso", value: dash.enProceso, tone: "sky", desc: "En gestión activa", icon: "process" },
      { label: "Completadas", value: dash.completadas, tone: "green", desc: "Cerradas con éxito", icon: "done" },
      { label: "Alertas activas", value: dash.alertasActivas, tone: "red", desc: "Requieren atención", icon: "alert" },
    ];
  }, [dash]);

  const handleSave = async (data) => {
    try {
      const res = await fetch("/api/solicitudes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error al registrar.");
      notify("Solicitud registrada correctamente.");
      setShowForm(false);
      load();
    } catch (e) {
      notify(e.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Resumen operativo de solicitudes empresariales.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          Registrar solicitud
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loading
          ? [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Solicitudes recientes</h2>
            <Link href="/solicitudes" className="text-sm font-medium text-blue-700 hover:underline">Ver todas</Link>
          </div>
          <RequestsTable items={dash?.ultimas || []} compact loading={loading} />
        </div>
        {loading ? (
          <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        ) : (
          <AlertsPanel vencidas={alertas.vencidas || []} proximas={alertas.proximas || []} enRiesgo={[]} compact />
        )}
      </section>

      {showForm && (
        <SolicitudForm
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          empresas={empresas}
          responsables={responsables}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
