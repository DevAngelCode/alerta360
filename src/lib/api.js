import { NextResponse } from "next/server";

export function ok(data, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseId(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

export function toDateString(value) {
  if (!value) return null;
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const s = String(value);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export function normalizeSolicitud(row) {
  if (!row) return row;
  return {
    ...row,
    id: Number(row.id),
    empresa_id: row.empresa_id != null ? Number(row.empresa_id) : null,
    responsable_id: row.responsable_id != null ? Number(row.responsable_id) : null,
    fechaLimite: toDateString(row.fecha_limite),
    fecha_limite: toDateString(row.fecha_limite),
    empresa: row.empresa_nombre || row.empresa || "",
    responsable: row.responsable_nombre || row.responsable || "",
  };
}
