import { query } from "@/lib/db";
import { ok, fail, parseId, isValidEmail } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const respId = parseId(id);
    if (!respId) return fail("ID inválido.");
    const { rows } = await query(
      `SELECT r.id, r.nombre, r.correo, r.empresa_id, r.created_at, e.nombre AS empresa_nombre
       FROM responsables r JOIN empresas e ON e.id = r.empresa_id WHERE r.id = $1`,
      [respId]
    );
    if (rows.length === 0) return fail("Responsable no encontrado.", 404);
    const r = rows[0];
    return ok({ ...r, id: Number(r.id), empresa_id: Number(r.empresa_id) });
  } catch (e) {
    return fail("Error al obtener el responsable.", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const respId = parseId(id);
    if (!respId) return fail("ID inválido.");
    const body = await request.json();
    const nombre = (body.nombre || "").trim();
    const correo = (body.correo || "").trim().toLowerCase();
    const empresaId = parseId(body.empresa_id);
    if (!nombre || !correo || !empresaId) return fail("Nombre, correo y empresa son obligatorios.");
    if (!isValidEmail(correo)) return fail("El correo no es válido.");
    const emp = await query("SELECT id FROM empresas WHERE id = $1", [empresaId]);
    if (emp.rows.length === 0) return fail("La empresa seleccionada no existe.", 400);
    const { rows } = await query(
      "UPDATE responsables SET nombre=$1, correo=$2, empresa_id=$3 WHERE id=$4 RETURNING id, nombre, correo, empresa_id, created_at",
      [nombre, correo, empresaId, respId]
    );
    if (rows.length === 0) return fail("Responsable no encontrado.", 404);
    const r = rows[0];
    return ok({ ...r, id: Number(r.id), empresa_id: Number(r.empresa_id) });
  } catch (e) {
    if (e.code === "23505") return fail("El correo ya está registrado.", 409);
    return fail("Error al actualizar el responsable.", 500);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const respId = parseId(id);
    if (!respId) return fail("ID inválido.");
    const rel = await query("SELECT COUNT(*) AS sol FROM solicitudes WHERE responsable_id = $1", [respId]);
    if (Number(rel.rows[0].sol) > 0) {
      return fail("No se puede eliminar el responsable porque tiene solicitudes relacionadas.", 409);
    }
    const { rowCount } = await query("DELETE FROM responsables WHERE id = $1", [respId]);
    if (rowCount === 0) return fail("Responsable no encontrado.", 404);
    return ok({ deleted: true });
  } catch (e) {
    return fail("Error al eliminar el responsable.", 500);
  }
}
