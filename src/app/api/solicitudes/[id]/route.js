import { query } from "@/lib/db";
import { ok, fail, parseId, normalizeSolicitud } from "@/lib/api";

export const runtime = "nodejs";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"];
const ESTADOS = ["PENDIENTE", "EN_PROCESO", "COMPLETADA"];

function mapPrioridad(v) { return PRIORIDADES.includes(String(v || "").toUpperCase()) ? String(v).toUpperCase() : null; }
function mapEstado(v) {
  const raw = String(v || "").toUpperCase().replace(/\s+/g, "_");
  return ESTADOS.includes(raw) ? raw : null;
}

const baseSelect = `
  SELECT s.id, s.titulo, s.descripcion, s.departamento, s.responsable, s.prioridad, s.estado,
         s.fecha_limite, s.created_at, s.updated_at, s.empresa_id, s.responsable_id,
         s.empresa, e.nombre AS empresa_nombre, r.nombre AS responsable_nombre
  FROM solicitudes s
  LEFT JOIN empresas e ON e.id = s.empresa_id
  LEFT JOIN responsables r ON r.id = s.responsable_id`;

export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const solId = parseId(id);
    if (!solId) return fail("ID inválido.");
    const { rows } = await query(baseSelect + " WHERE s.id = $1", [solId]);
    if (rows.length === 0) return fail("Solicitud no encontrada.", 404);
    return ok(normalizeSolicitud(rows[0]));
  } catch (e) {
    return fail("Error al obtener la solicitud.", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const solId = parseId(id);
    if (!solId) return fail("ID inválido.");
    const body = await request.json();
    const titulo = (body.titulo || "").trim();
    const descripcion = body.descripcion ? String(body.descripcion).trim() : null;
    const departamento = body.departamento ? String(body.departamento).trim() : null;
    const prioridad = mapPrioridad(body.prioridad);
    const estado = mapEstado(body.estado);
    const fechaLimite = body.fecha_limite || body.fechaLimite;
    const empresaId = parseId(body.empresa_id);
    const responsableId = parseId(body.responsable_id);

    if (!titulo || !prioridad || !estado || !fechaLimite || !empresaId || !responsableId) {
      return fail("Título, prioridad, estado, fecha límite, empresa y responsable son obligatorios.");
    }

    const emp = await query("SELECT id, nombre FROM empresas WHERE id = $1", [empresaId]);
    if (emp.rows.length === 0) return fail("La empresa seleccionada no existe.", 400);
    const resp = await query("SELECT id, nombre, empresa_id FROM responsables WHERE id = $1", [responsableId]);
    if (resp.rows.length === 0) return fail("El responsable seleccionado no existe.", 400);
    if (Number(resp.rows[0].empresa_id) !== empresaId) {
      return fail("El responsable no pertenece a la empresa seleccionada.", 400);
    }

    const empresaNombre = emp.rows[0].nombre;
    const responsableNombre = resp.rows[0].nombre;

    const { rows } = await query(
      `UPDATE solicitudes SET
        titulo=$1, descripcion=$2, departamento=$3, responsable=$4, prioridad=$5, estado=$6,
        fecha_limite=$7, empresa_id=$8, responsable_id=$9, empresa=$10, updated_at=NOW()
       WHERE id=$11
       RETURNING id, titulo, descripcion, departamento, responsable, prioridad, estado, fecha_limite, created_at, updated_at, empresa_id, responsable_id, empresa`,
      [titulo, descripcion, departamento, responsableNombre, prioridad, estado, fechaLimite, empresaId, responsableId, empresaNombre, solId]
    );
    if (rows.length === 0) return fail("Solicitud no encontrada.", 404);
    const row = rows[0];
    return ok(normalizeSolicitud({ ...row, empresa_nombre: empresaNombre, responsable_nombre: responsableNombre }));
  } catch (e) {
    return fail("Error al actualizar la solicitud.", 500);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const solId = parseId(id);
    if (!solId) return fail("ID inválido.");
    const { rowCount } = await query("DELETE FROM solicitudes WHERE id = $1", [solId]);
    if (rowCount === 0) return fail("Solicitud no encontrada.", 404);
    return ok({ deleted: true });
  } catch (e) {
    return fail("Error al eliminar la solicitud.", 500);
  }
}
