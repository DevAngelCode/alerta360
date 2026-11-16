import { query } from "@/lib/db";
import { ok, fail, parseId } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const empresaId = parseId(id);
    if (!empresaId) return fail("ID inválido.");
    const { rows } = await query(
      "SELECT id, nombre, ruc, created_at FROM empresas WHERE id = $1",
      [empresaId]
    );
    if (rows.length === 0) return fail("Empresa no encontrada.", 404);
    return ok({ ...rows[0], id: Number(rows[0].id) });
  } catch (e) {
    return fail("Error al obtener la empresa.", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const empresaId = parseId(id);
    if (!empresaId) return fail("ID inválido.");
    const body = await request.json();
    const nombre = (body.nombre || "").trim();
    const ruc = (body.ruc || "").trim();
    if (!nombre || !ruc) return fail("Nombre y RUC son obligatorios.");
    const dup = await query("SELECT id FROM empresas WHERE ruc = $1 AND id <> $2", [ruc, empresaId]);
    if (dup.rows.length > 0) return fail("El RUC ya está registrado.", 409);
    const { rows } = await query(
      "UPDATE empresas SET nombre = $1, ruc = $2 WHERE id = $3 RETURNING id, nombre, ruc, created_at",
      [nombre, ruc, empresaId]
    );
    if (rows.length === 0) return fail("Empresa no encontrada.", 404);
    return ok({ ...rows[0], id: Number(rows[0].id) });
  } catch (e) {
    if (e.code === "23505") return fail("El RUC ya está registrado.", 409);
    return fail("Error al actualizar la empresa.", 500);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const empresaId = parseId(id);
    if (!empresaId) return fail("ID inválido.");
    const rel = await query(
      "SELECT (SELECT COUNT(*) FROM responsables WHERE empresa_id = $1) AS resp, (SELECT COUNT(*) FROM solicitudes WHERE empresa_id = $1) AS sol",
      [empresaId]
    );
    const { resp, sol } = rel.rows[0];
    if (Number(resp) > 0 || Number(sol) > 0) {
      return fail("No se puede eliminar la empresa porque tiene responsables o solicitudes relacionadas.", 409);
    }
    const { rowCount } = await query("DELETE FROM empresas WHERE id = $1", [empresaId]);
    if (rowCount === 0) return fail("Empresa no encontrada.", 404);
    return ok({ deleted: true });
  } catch (e) {
    return fail("Error al eliminar la empresa.", 500);
  }
}
