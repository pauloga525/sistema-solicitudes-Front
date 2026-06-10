import * as XLSX from 'xlsx';

const CURSO_LABELS = {
  '1ro_Basica': '1ro Básica',
  '2do_Basica': '2do Básica',
  '3ro_Basica': '3ro Básica',
  '4to_Basica': '4to Básica',
  '5to':        '5to',
  '6to':        '6to',
  '7mo':        '7mo',
  '8vo':        '8vo',
  '9no':        '9no',
  '10mo':       '10mo',
  '1ro_Bach':   '1ro Bach',
  '2do_Bach':   '2do Bach',
  '3ro_Bach':   '3ro Bach',
};

const ESTADO_LABELS = {
  pendiente:    'Pendiente',
  aprobado:     'Aprobado',
  rechazado:    'Rechazado',
  en_revision:  'En Revisión',
  cancelado:    'Cancelado',
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Exporta las solicitudes visibles a un archivo .xlsx.
 * @param {Array}  solicitudes    - Lista filtrada que se muestra en la tabla.
 * @param {object} activeFilters  - Filtros activos para nombrar el archivo.
 */
export function exportSolicitudesToExcel(solicitudes, activeFilters) {
  if (solicitudes.length === 0) return;

  const subject  = activeFilters.subject  || '';
  const course   = activeFilters.course   || '';
  const paralelo = activeFilters.paralelo || '';
  const fileDate = new Date().toISOString().slice(0, 10);

  // ── Filas de datos ──────────────────────────────────────────────────────────
  const rows = solicitudes.map((s) => ({
    'N° Solicitud':       s.requestNumber ?? s._id?.slice(-6),
    'Estudiante':         s.studentName,
    'Curso':              CURSO_LABELS[s.course] ?? s.course?.replace(/_/g, ' ') ?? '—',
    'Paralelo':           s.paralelo ?? '—',
    'Campus':             s.campus?.replace(/_/g, ' ') ?? '—',
    'Representante':      s.representativeName,
    'CI Representante':   s.representativeDni,
    'Materias Solicitadas': subject
      ? subject
      : (s.payload?.subjects ?? []).join(', '),
    'Estado':             ESTADO_LABELS[s.status] ?? s.status,
    'Fecha de Solicitud': formatDate(s.createdAt),
  }));

  // ── Hoja de cálculo ─────────────────────────────────────────────────────────
  const ws = XLSX.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 18 }, // N° Solicitud
    { wch: 30 }, // Estudiante
    { wch: 14 }, // Curso
    { wch: 10 }, // Paralelo
    { wch: 22 }, // Campus
    { wch: 30 }, // Representante
    { wch: 16 }, // CI
    { wch: 50 }, // Materias
    { wch: 14 }, // Estado
    { wch: 18 }, // Fecha
  ];

  // ── Nombre de hoja (Excel máx 31 chars) ─────────────────────────────────────
  const sheetName = subject
    ? subject.slice(0, 31)
    : 'Solicitudes';

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // ── Nombre del archivo ───────────────────────────────────────────────────────
  const parts = ['solicitudes'];
  if (subject)  parts.push(subject.replace(/\s+/g, '_'));
  if (course)   parts.push(course.replace(/\s+/g, '_'));
  if (paralelo) parts.push(`paralelo_${paralelo}`);
  parts.push(fileDate);

  XLSX.writeFile(wb, `${parts.join('-')}.xlsx`);
}
