import { query } from "@/lib/db";
import { ok, fail, normalizeSolicitud } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sql = `
      SELECT s.id, s.titulo, s.descripcion, s.departamento, s.responsable, s.prioridad, s.estado,
             s.fecha_limite, s.created_at, s.updated_at, s.empresa_id, s.responsable_id,
             s.empresa, e.nombre AS empresa_nombre, r.nombre AS responsable_nombre,
             CASE
               WHEN s.fecha_limite < CURRENT_DATE THEN 'vencida'
               WHEN s.fecha_limite <= CURRENT_DATE + INTERVAL '2 day' THEN 'proxima'
               ELSE 'en_plazo'
             END AS categoria
      FROM solicitudes s
      LEFT JOIN empresas e ON e.id = s.empresa_id
      LEFT JOIN responsables r ON r.id = s.responsable_id
      WHERE s.estado <> 'COMPLETADA' AND s.fecha_limite <= CURRENT_DATE + INTERVAL '2 day'
      ORDER BY s.fecha_limite ASC`;
    const { rows } = await query(sql);
    const vencidas = [];
    const proximas = [];
    rows.forEach((r) => {
      const item = { ...normalizeSolicitud(r), categoria: r.categoria };
      if (r.categoria === "vencida") vencidas.push(item);
      else if (r.categoria === "proxima") proximas.push(item);
    });
    return ok({
      vencidas,
      proximas,
      cantidad: vencidas.length + proximas.length,
    });
  } catch (e) {
    return fail("Error al obtener alertas.", 500);
  }
}
