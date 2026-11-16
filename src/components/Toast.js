export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  const styles = type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white";
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-sm shadow-lg ${styles}`} role="status">
      <span>{message}</span>
      <button onClick={onClose} className="rounded p-0.5 text-white/80 hover:text-white" aria-label="Cerrar">✕</button>
    </div>
  );
}
