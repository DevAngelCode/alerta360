const tones = {
  blue: "border-sky-500 text-sky-700 bg-sky-50",
  amber: "border-amber-500 text-amber-700 bg-amber-50",
  green: "border-emerald-500 text-emerald-700 bg-emerald-50",
  red: "border-red-500 text-red-700 bg-red-50",
};

export default function StatCard({ label, value, tone = "blue" }) {
  return (
    <div className={`rounded-xl border-l-4 bg-white p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
