"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  dashboard: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
  ),
  solicitudes: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
  ),
  alertas: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-7.4 12.84A2 2 0 004.6 20h14.8a2 2 0 001.71-3.3l-7.4-12.84a2 2 0 00-3.42 0z" /></svg>
  ),
  empresas: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7a2 2 0 012-2h4v16M11 21V3h6a2 2 0 012 2v16M9 9h.01M9 13h.01M15 9h.01M15 13h.01" /></svg>
  ),
  responsables: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m14 0h4v-1a4 4 0 00-3-3.87M13 7a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
};

const menu = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/solicitudes", label: "Solicitudes", icon: "solicitudes" },
  { href: "/alertas", label: "Alertas", icon: "alertas" },
  { href: "/empresas", label: "Empresas", icon: "empresas" },
  { href: "/responsables", label: "Responsables", icon: "responsables" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">A3</div>
          <div className="text-xl font-bold tracking-tight text-slate-900">Alerta360</div>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          Anticipamos riesgos. Impulsamos resultados.
        </p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent pl-2"
              }`}
            >
              <span className={active ? "text-blue-600" : "text-slate-400"}>{icons[item.icon]}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">LM</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">Laura Martínez</p>
            <p className="truncate text-xs text-slate-500">Operaciones</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
