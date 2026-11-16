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
    estado: "En proceso",
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
    estado: "En proceso",
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
  {
    id: "SOL-1017",
    titulo: "Capacitación operativa",
    descripcion: "Plan de capacitación para nuevo personal operativo.",
    empresa: "Grupo Andina",
    departamento: "RR. HH.",
    responsable: "María López",
    prioridad: "Media",
    estado: "En proceso",
    fechaLimite: "2026-11-25",
  },
];

export const initialEmpresas = [
  { id: "EMP-01", nombre: "Grupo Andina", rubro: "Comercio", contacto: "contacto@andina.com", estado: "Activa" },
  { id: "EMP-02", nombre: "Logística Norte", rubro: "Logística", contacto: "info@lognorte.com", estado: "Activa" },
  { id: "EMP-03", nombre: "Finanzas Sur", rubro: "Finanzas", contacto: "soporte@finsur.com", estado: "Activa" },
  { id: "EMP-04", nombre: "Retail Pacífico", rubro: "Retail", contacto: "admin@rpacifico.com", estado: "Activa" },
  { id: "EMP-05", nombre: "TechNova", rubro: "Tecnología", contacto: "hola@technova.com", estado: "Activa" },
  { id: "EMP-06", nombre: "Salud Integral", rubro: "Salud", contacto: "contacto@saludint.com", estado: "Inactiva" },
];

export const initialResponsables = [
  { id: "RES-01", nombre: "María López", correo: "maria.lopez@alerta360.com", empresa: "Grupo Andina" },
  { id: "RES-02", nombre: "Carlos Pérez", correo: "carlos.perez@alerta360.com", empresa: "Logística Norte" },
  { id: "RES-03", nombre: "Ana Torres", correo: "ana.torres@alerta360.com", empresa: "Finanzas Sur" },
  { id: "RES-04", nombre: "Jorge Díaz", correo: "jorge.diaz@alerta360.com", empresa: "Retail Pacífico" },
  { id: "RES-05", nombre: "Lucía Gómez", correo: "lucia.gomez@alerta360.com", empresa: "TechNova" },
  { id: "RES-06", nombre: "Pedro Ruiz", correo: "pedro.ruiz@alerta360.com", empresa: "Salud Integral" },
];

export const TODAY = new Date("2026-11-16");

export function diasRestantes(fechaLimite) {
  const diff = new Date(fechaLimite) - TODAY;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getAlertCategory(s) {
  if (s.estado === "Completada") return null;
  const d = diasRestantes(s.fechaLimite);
  if (d < 0) return "vencida";
  if (d <= 1) return "proxima";
  if (d <= 3) return "riesgo";
  return null;
}

export function computeStats(solicitudes) {
  const total = solicitudes.length;
  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
  const enProceso = solicitudes.filter((s) => s.estado === "En proceso").length;
  const completadas = solicitudes.filter((s) => s.estado === "Completada").length;
  const alertasActivas = solicitudes.filter((s) => getAlertCategory(s) !== null).length;
  return [
    { label: "Total de solicitudes", value: total, tone: "blue", desc: "Registradas en el sistema", icon: "total" },
    { label: "Pendientes", value: pendientes, tone: "amber", desc: "Por iniciar", icon: "pending" },
    { label: "En proceso", value: enProceso, tone: "sky", desc: "En gestión activa", icon: "process" },
    { label: "Completadas", value: completadas, tone: "green", desc: "Cerradas con éxito", icon: "done" },
    { label: "Alertas activas", value: alertasActivas, tone: "red", desc: "Requieren atención", icon: "alert" },
  ];
}
