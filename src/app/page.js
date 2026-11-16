"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import RequestsTable from "@/components/RequestsTable";
import AlertsPanel from "@/components/AlertsPanel";
import { initialSolicitudes, computeStats } from "@/data/mockData";

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

export default function Home() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setSolicitudes(initialSolicitudes);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const stats = useMemo(() => computeStats(solicitudes), [solicitudes]);
  const { proximas, vencidas } = useMemo(() => splitAlertas(solicitudes), [solicitudes]);
  const recientes = useMemo(
    () => [...solicitudes].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5),
    [solicitudes]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Resumen operativo de solicitudes empresariales</p>
        </div>
        <Link href="/solicitudes" className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800">
          + Registrar nueva solicitud
        </Link>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Solicitudes recientes</h2>
            <Link href="/solicitudes" className="text-sm font-medium text-sky-700 hover:underline">Ver todas</Link>
          </div>
          <RequestsTable items={recientes} compact loading={loading} />
        </div>
        {loading ? (
          <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
        ) : (
          <AlertsPanel proximas={proximas} vencidas={vencidas} compact />
        )}
      </section>
    </div>
  );
}
