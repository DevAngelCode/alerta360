import { query } from "@/lib/db";
import { ok, fail, parseId, normalizeSolicitud } from "@/lib/api";

export const runtime = "nodejs";

const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"];
const ESTADOS = ["PENDIENTE", "EN_PROCESO", "COMPLETADA"];

function mapPrioridad(v) {
  const m = { BAJA: "BAJA", MEDIA: "MEDIA", ALTA: "ALTA" };
  return m[String(v || "").toUpperCase()] || null;
}
function mapEstado(v) {
  const raw = String(v || "").toUpperCase().replace(/\s+/g, "_");
  if (raw === "EN_PROCESO" || raw === "ENPROCESO") return "EN_PROCESO";
  if (raw === "PENDIENTE") return "PENDIENTE";
  if (raw === "COMPLETADA") return "COMPLETADA";
  return null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado");
    const prioridad = searchParams.get("prioridad");
    const empresaId = searchParams.get("empresa_id");
    const responsableId = searchParams.get("responsable_id");
    const q = searchParams.get("q");

    const where = [];
    const params = [];
    if (estado) { params.push(String(estado).toUpperCase().replace(/\s+/g, "_")); where.push(`s.estado = $${params.length}`); }
    if (prioridad) { params.push(String(prioridad).toUpperCase()); where.push(`s.prioridad = $${params.length}`); }
    if (empresaId) { const id = parseId(empresaId); if (!id) return fail("empresa_id inválido."); params.push(id); where.push(`s.empresa_id = $${params.length}`); }
    if (responsableId) { const id = parseId(responsableId); if (!id) return fail("responsable_id inválido."); params.push(id); where.push(`s.responsable_id = $${params.length}`); }
    if (q) { params.push(`%${q}%`); where.push(`s.titulo ILIKE $${params.length}`); }

    let sql = `
      SELECT s.id, s.titulo, s.descripcion, s.departamento, s.responsable, s.prioridad, s.estado,
             s.fecha_limite, s.created_at, s.updated_at, s.empresa_id, s.responsable_id,
             s.empresa, e.nombre AS empresa_nombre, r.nombre AS responsable_nombre
      FROM solicitudes s
      LEFT JOIN empresas e ON e.id = s.empresa_id
      LEFT JOIN responsables r ON r.id = s.responsable_id`;
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY s.fecha_limite ASC, s.id DESC";

    const { rows } = await query(sql, params);
    return ok(rows.map(normalizeSolicitud));
  } catch (e) {
    return fail("Error al obtener solicitudes.", 500);
  }
}

export async function POST(request) {
  try {
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
    if (!PRIORIDADES.includes(prioridad)) return fail("Prioridad inválida.");
    if (!ESTADOS.includes(estado)) return fail("Estado inválido.");

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
      `INSERT INTO solicitudes
        (titulo, descripcion, departamento, responsable, prioridad, estado, fecha_limite, empresa_id, responsable_id, empresa, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
       RETURNING id, titulo, descripcion, departamento, responsable, prioridad, estado, fecha_limite, created_at, updated_at, empresa_id, responsable_id, empresa`,
      [titulo, descripcion, departamento, responsableNombre, prioridad, estado, fechaLimite, empresaId, responsableId, empresaNombre]
    );
    const row = rows[0];
    return ok(normalizeSolicitud({ ...row, empresa_nombre: empresaNombre, responsable_nombre: responsableNombre }), 201);
  } catch (e) {
    return fail("Error al registrar la solicitud.", 500);
  }
}
