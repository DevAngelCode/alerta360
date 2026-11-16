import { query } from "@/lib/db";
import { ok, fail, isValidEmail, parseId } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const empresaIdParam = searchParams.get("empresa_id");
    let sql = `SELECT r.id, r.nombre, r.correo, r.empresa_id, r.created_at, e.nombre AS empresa_nombre
               FROM responsables r JOIN empresas e ON e.id = r.empresa_id`;
    const params = [];
    if (empresaIdParam) {
      const empresaId = parseId(empresaIdParam);
      if (!empresaId) return fail("empresa_id inválido.");
      params.push(empresaId);
      sql += " WHERE r.empresa_id = $1";
    }
    sql += " ORDER BY r.id DESC";
    const { rows } = await query(sql, params);
    return ok(rows.map((r) => ({ ...r, id: Number(r.id), empresa_id: Number(r.empresa_id) })));
  } catch (e) {
    return fail("Error al obtener responsables.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nombre = (body.nombre || "").trim();
    const correo = (body.correo || "").trim().toLowerCase();
    const empresaId = parseId(body.empresa_id);
    if (!nombre || !correo || !empresaId) {
      return fail("Nombre, correo y empresa son obligatorios.");
    }
    if (!isValidEmail(correo)) return fail("El correo no es válido.");
    const emp = await query("SELECT id FROM empresas WHERE id = $1", [empresaId]);
    if (emp.rows.length === 0) return fail("La empresa seleccionada no existe.", 400);
    const { rows } = await query(
      "INSERT INTO responsables (nombre, correo, empresa_id) VALUES ($1, $2, $3) RETURNING id, nombre, correo, empresa_id, created_at",
      [nombre, correo, empresaId]
    );
    const row = rows[0];
    return ok({ ...row, id: Number(row.id), empresa_id: Number(row.empresa_id) }, 201);
  } catch (e) {
    if (e.code === "23505") return fail("El correo ya está registrado.", 409);
    return fail("Error al registrar responsable.", 500);
  }
}
