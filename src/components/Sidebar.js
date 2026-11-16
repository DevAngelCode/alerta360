"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Dashboard" },
  { href: "/solicitudes", label: "Solicitudes" },
  { href: "/alertas", label: "Alertas" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="text-2xl font-bold tracking-tight">Alerta360</div>
        <p className="mt-2 text-xs text-sky-200 leading-relaxed">
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
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sky-600 text-white"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 text-xs text-slate-400 border-t border-slate-800">
        Panel empresarial
      </div>
    </aside>
  );
}
