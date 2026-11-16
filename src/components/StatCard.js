const tones = {
  blue: { border: "border-blue-500", icon: "bg-blue-50 text-blue-600" },
  amber: { border: "border-amber-400", icon: "bg-amber-50 text-amber-600" },
  sky: { border: "border-sky-400", icon: "bg-sky-50 text-sky-600" },
  green: { border: "border-emerald-500", icon: "bg-emerald-50 text-emerald-600" },
  red: { border: "border-red-500", icon: "bg-red-50 text-red-600" },
};

const icons = {
  total: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  pending: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  process: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  done: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  alert: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
};

export default function StatCard({ label, value, tone = "blue", desc, icon }) {
  const t = tones[tone] || tones.blue;
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 ${t.border} bg-white p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {desc && <p className="mt-1 text-xs text-slate-500">{desc}</p>}
        </div>
        {icon && icons[icon] && (
          <div className={`rounded-lg p-2 ${t.icon}`}>{icons[icon]}</div>
        )}
      </div>
    </div>
  );
}
