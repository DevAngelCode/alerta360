import { query } from "@/lib/db";
import { ok, fail, normalizeSolicitud } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const countsSql = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE estado = 'PENDIENTE')::int AS pendientes,
        COUNT(*) FILTER (WHERE estado = 'EN_PROCESO')::int AS en_proceso,
        COUNT(*) FILTER (WHERE estado = 'COMPLETADA')::int AS completadas,
        COUNT(*) FILTER (WHERE estado <> 'COMPLETADA' AND fecha_limite < CURRENT_DATE)::int AS vencidas,
        COUNT(*) FILTER (WHERE estado <> 'COMPLETADA' AND fecha_limite >= CURRENT_DATE AND fecha_limite <= CURRENT_DATE + INTERVAL '2 day')::int AS proximas
      FROM solicitudes`;
    const { rows: countRows } = await query(countsSql);
    const c = countRows[0];

    const ultimasSql = `
      SELECT s.id, s.titulo, s.descripcion, s.departamento, s.responsable, s.prioridad, s.estado,
             s.fecha_limite, s.created_at, s.updated_at, s.empresa_id, s.responsable_id,
             s.empresa, e.nombre AS empresa_nombre, r.nombre AS responsable_nombre
      FROM solicitudes s
      LEFT JOIN empresas e ON e.id = s.empresa_id
      LEFT JOIN responsables r ON r.id = s.responsable_id
      ORDER BY s.created_at DESC NULLS LAST, s.id DESC
      LIMIT 5`;
    const { rows: ultimas } = await query(ultimasSql);

    return ok({
      total: c.total,
      pendientes: c.pendientes,
      enProceso: c.en_proceso,
      completadas: c.completadas,
      vencidas: c.vencidas,
      proximas: c.proximas,
      alertasActivas: c.vencidas + c.proximas,
      ultimas: ultimas.map(normalizeSolicitud),
    });
  } catch (e) {
    return fail("Error al obtener datos del dashboard.", 500);
  }
}
