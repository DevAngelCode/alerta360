"use client";

import { useEffect, useMemo, useState } from "react";
import AlertsPanel from "@/components/AlertsPanel";
import { initialSolicitudes } from "@/data/mockData";

const TODAY = new Date("2026-11-16");

function splitAlertas(solicitudes) {
  const proximas = [];
  const vencidas = [];
  solicitudes.forEach((s) => {
    if (s.estado === "Completada") return;
    const diff = (new Date(s.fechaLimite) - TODAY) / (1000 * 60 * 60 * 24);
    if (diff < 0) vencidas.push(s);
    else if (diff <= 3) proximas.push(s);
  });
  return { proximas, vencidas };
}

export default function AlertasPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData(initialSolicitudes);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const { proximas, vencidas } = useMemo(() => splitAlertas(data), [data]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Alertas</h1>
        <p className="text-sm text-slate-600">Solicitudes vencidas y próximas a vencer que requieren atención</p>
      </header>
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">Cargando alertas...</div>
      ) : (
        <div className="max-w-3xl">
          <AlertsPanel proximas={proximas} vencidas={vencidas} />
        </div>
      )}
    </div>
  );
}
