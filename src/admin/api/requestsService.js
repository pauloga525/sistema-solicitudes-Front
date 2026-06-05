import { API_BASE_URL, SUBJECTS_PERMITIDOS } from './config';
import { getToken, logout } from './authService';

async function apiFetch(path, options = {}) {
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    logout();
    window.location.href = '/admin/login';
    return;
  }

  if (options._blob) {
    if (!res.ok) throw new ApiError(res.status, 'Error al descargar el PDF');
    return res.blob();
  }

  let body = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  }

  if (!res.ok) {
    throw new ApiError(res.status, body?.message ?? 'Error desconocido', body);
  }

  return body;
}

export class ApiError extends Error {
  constructor(status, message, body = null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function validateCreatePayload({
  requestType,
  representativeName,
  representativeDni,
  studentName,
  course,
  paralelo,
  payload,
}) {
  const errors = [];

  if (!requestType) errors.push('requestType es requerido');
  if (!representativeName) errors.push('Nombre del representante es requerido');
  if (!representativeDni) errors.push('Cédula del representante es requerida');
  if (!studentName) errors.push('Nombre del estudiante es requerido');
  if (!course) errors.push('Curso es requerido');
  if (!paralelo) errors.push('Paralelo es requerido');

  if (
    !payload?.subjects ||
    !Array.isArray(payload.subjects) ||
    payload.subjects.length === 0
  ) {
    errors.push('Debe seleccionar al menos una materia');
  } else {
    const invalidas = payload.subjects.filter(
      (s) => !SUBJECTS_PERMITIDOS.includes(s),
    );
    if (invalidas.length > 0) {
      errors.push(`Materias no permitidas: ${invalidas.join(', ')}`);
    }
  }

  if (errors.length > 0) throw new ValidationError(errors);
}

export class ValidationError extends Error {
  constructor(errors) {
    super(errors.join(' | '));
    this.errors = errors;
  }
}

export async function createRequest(data) {
  validateCreatePayload(data);
  const body = {
    requestType: data.requestType,
    representativeName: data.representativeName,
    representativeDni: data.representativeDni,
    studentName: data.studentName,
    course: data.course,
    paralelo: data.paralelo,
    payload: { subjects: data.payload.subjects },
  };
  return apiFetch('/requests', { method: 'POST', body: JSON.stringify(body) });
}

export async function getRequests(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.campus) params.set('campus', filters.campus);
  if (filters.course) params.set('course', filters.course);
  if (filters.search) params.set('search', filters.search);
  const query = params.toString();
  return apiFetch(`/requests${query ? `?${query}` : ''}`);
}

export async function getRequestById(id) {
  return apiFetch(`/requests/${id}`);
}

export async function updateRequestStatus(id, status) {
  return apiFetch(`/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function downloadRequestPdf(id) {
  const blob = await apiFetch(`/requests/${id}/pdf`, { _blob: true });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solicitud-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function printRequestPdf(id) {
  const blob = await apiFetch(`/requests/${id}/pdf`, { _blob: true });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.addEventListener('load', () => {
      setTimeout(() => {
        win.focus();
        win.print();
      }, 400);
    });
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  }
}

export function getErrorMessage(err) {
  if (err instanceof ValidationError) return err.errors.join('\n');
  if (err instanceof ApiError) {
    switch (err.status) {
      case 400:
        return `Datos inválidos: ${err.message}`;
      case 404:
        return 'Solicitud no encontrada';
      case 409:
        return 'Ya existe una solicitud con estos datos';
      case 500:
        return 'Error en el servidor. Intente más tarde';
      default:
        return err.message;
    }
  }
  return 'Error de conexión. Verifique su red.';
}
