"use client";

import { useEffect, useState } from "react";
import AlertsPanel from "@/components/AlertsPanel";

export default function AlertasPage() {
  const [data, setData] = useState({ vencidas: [], proximas: [], cantidad: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/alertas");
        const json = await res.json();
        if (!active) return;
        if (!json.ok) throw new Error(json.error || "Error al cargar alertas.");
        setData(json.data);
        setError(null);
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Alertas</h1>
        <p className="mt-1 text-sm text-slate-600">Solicitudes vencidas y próximas a vencer que requieren atención.</p>
      </header>
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
          Cargando alertas...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : (
        <div className="max-w-4xl">
          <AlertsPanel vencidas={data.vencidas || []} proximas={data.proximas || []} enRiesgo={[]} />
        </div>
      )}
    </div>
  );
}
