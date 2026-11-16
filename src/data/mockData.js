export const initialSolicitudes = [
  {
    id: "SOL-1024",
    titulo: "Renovación de contrato",
    descripcion: "Revisar y renovar contrato marco con condiciones actualizadas.",
    empresa: "Grupo Andina",
    departamento: "Compras",
    responsable: "María López",
    prioridad: "Alta",
    estado: "Pendiente",
    fechaLimite: "2026-11-18",
  },
  {
    id: "SOL-1023",
    titulo: "Soporte técnico urgente",
    descripcion: "Incidencia en sistema de logística que afecta despachos.",
    empresa: "Logística Norte",
    departamento: "Operaciones",
    responsable: "Carlos Pérez",
    prioridad: "Media",
    estado: "En progreso",
    fechaLimite: "2026-11-20",
  },
  {
    id: "SOL-1022",
    titulo: "Alta de servicio",
    descripcion: "Activación de nuevo servicio de monitoreo para sucursal.",
    empresa: "Finanzas Sur",
    departamento: "TI",
    responsable: "Ana Torres",
    prioridad: "Baja",
    estado: "Completada",
    fechaLimite: "2026-11-15",
  },
  {
    id: "SOL-1021",
    titulo: "Actualización de datos",
    descripcion: "Actualizar información fiscal y contactos principales.",
    empresa: "Retail Pacífico",
    departamento: "Administración",
    responsable: "Jorge Díaz",
    prioridad: "Alta",
    estado: "Pendiente",
    fechaLimite: "2026-11-17",
  },
  {
    id: "SOL-1020",
    titulo: "Revisión SLA",
    descripcion: "Evaluar cumplimiento de acuerdos de nivel de servicio.",
    empresa: "TechNova",
    departamento: "Calidad",
    responsable: "Lucía Gómez",
    prioridad: "Media",
    estado: "En progreso",
    fechaLimite: "2026-11-22",
  },
  {
    id: "SOL-1019",
    titulo: "Proceso de facturación",
    descripcion: "Regularizar facturas pendientes del último trimestre.",
    empresa: "Salud Integral",
    departamento: "Finanzas",
    responsable: "Pedro Ruiz",
    prioridad: "Baja",
    estado: "Completada",
    fechaLimite: "2026-11-14",
  },
  {
    id: "SOL-1018",
    titulo: "Auditoría de accesos",
    descripcion: "Revisión de permisos de usuarios en plataformas internas.",
    empresa: "Innova Corp",
    departamento: "Seguridad",
    responsable: "Sofía Méndez",
    prioridad: "Alta",
    estado: "Pendiente",
    fechaLimite: "2026-11-12",
  },
];

export function computeStats(solicitudes) {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
  const completadas = solicitudes.filter((s) => s.estado === "Completada").length;
  const today = new Date("2026-11-16");
  const alertas = solicitudes.filter((s) => {
    if (s.estado === "Completada") return false;
    const d = new Date(s.fechaLimite);
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  }).length;
  return [
    { label: "Total de solicitudes", value: total, tone: "blue" },
    { label: "Pendientes", value: pendientes, tone: "amber" },
    { label: "Completadas", value: completadas, tone: "green" },
    { label: "Alertas", value: alertas, tone: "red" },
  ];
}
