import { query } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { rows } = await query(
      "SELECT id, nombre, ruc, created_at FROM empresas ORDER BY id DESC"
    );
    return ok(rows.map((r) => ({ ...r, id: Number(r.id) })));
  } catch (e) {
    return fail("Error al obtener empresas.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nombre = (body.nombre || "").trim();
    const ruc = (body.ruc || "").trim();
    if (!nombre || !ruc) {
      return fail("Nombre y RUC son obligatorios.");
    }
    const dup = await query("SELECT id FROM empresas WHERE ruc = $1", [ruc]);
    if (dup.rows.length > 0) {
      return fail("El RUC ya está registrado.", 409);
    }
    const { rows } = await query(
      "INSERT INTO empresas (nombre, ruc) VALUES ($1, $2) RETURNING id, nombre, ruc, created_at",
      [nombre, ruc]
    );
    return ok({ ...rows[0], id: Number(rows[0].id) }, 201);
  } catch (e) {
    if (e.code === "23505") return fail("El RUC ya está registrado.", 409);
    return fail("Error al registrar empresa.", 500);
  }
}
