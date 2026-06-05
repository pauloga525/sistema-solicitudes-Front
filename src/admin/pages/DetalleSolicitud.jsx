import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getRequestById,
  updateRequestStatus,
  downloadRequestPdf,
  printRequestPdf,
  getErrorMessage,
} from '../api/requestsService';
import { logout, getUser } from '../api/authService';
import { REQUEST_STATUS } from '../api/config';

const ESTADO_CONFIG = {
  pendiente: {
    className: 'bg-secondary-container text-on-secondary-container',
    dotClass: 'bg-secondary animate-pulse',
    label: 'Pendiente de Revisión',
  },
  aprobado: {
    className: 'bg-primary-container text-on-primary-container',
    icon: 'verified',
    label: 'Aprobada',
  },
  rechazado: {
    className: 'bg-error-container text-error',
    icon: 'block',
    label: 'Rechazada',
  },
  en_revision: {
    className: 'bg-tertiary-fixed text-tertiary',
    dotClass: 'bg-tertiary',
    label: 'En Revisión',
  },
  cancelado: {
    className: 'bg-surface-container-high text-on-surface-variant',
    icon: 'cancel',
    label: 'Cancelada',
  },
};

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetalleSolicitud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  function handleBack() {
    navigate('/admin/dashboard');
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getRequestById(id)
      .then(setSolicitud)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(newStatus) {
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await updateRequestStatus(id, newStatus);
      setSolicitud(updated);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove() {
    await changeStatus(REQUEST_STATUS.APROBADO);
  }

  async function handleConfirmDeny() {
    if (!denyReason.trim()) {
      setActionError('Debe indicar el motivo del rechazo.');
      return;
    }
    await changeStatus(REQUEST_STATUS.RECHAZADO);
    setShowModal(false);
    setDenyReason('');
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    try {
      await downloadRequestPdf(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setPdfLoading(false);
    }
  }

  async function handlePrintPdf() {
    setPrintLoading(true);
    try {
      await printRequestPdf(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setPrintLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl animate-spin">
            progress_activity
          </span>
          <p className="font-body-lg text-body-lg">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <span className="material-symbols-outlined text-5xl text-error">
            error
          </span>
          <p className="font-body-lg text-body-lg text-on-surface">{error}</p>
          <button
            onClick={handleBack}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-lg text-label-lg"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  const status = solicitud?.status ?? 'pendiente';
  const requestType = solicitud?.requestType;
  const isProcesoDeMejora = requestType === 'proceso_mejora';
  const estadoConfig = ESTADO_CONFIG[status] ?? ESTADO_CONFIG.pendiente;
  const isPending = status === 'pendiente' || status === 'en_revision';
  const isApproved = status === 'aprobado';
  const initial = (user?.username ?? 'A')[0].toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-on-background ficha-bg flex-col">
      <header className="bg-surface sticky top-0 z-40 px-gutter h-16 flex items-center justify-between border-b border-outline-variant shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-surface-container rounded-full text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="font-title-lg text-title-lg font-bold text-primary">
            {solicitud?.requestNumber ?? `Solicitud #${id?.slice(-6)}`}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-1 rounded-full font-label-lg text-label-lg flex items-center gap-2 ${estadoConfig.className}`}
          >
            {estadoConfig.dotClass ? (
              <span
                className={`w-2 h-2 rounded-full ${estadoConfig.dotClass}`}
              />
            ) : (
              <span className="material-symbols-outlined text-sm">
                {estadoConfig.icon}
              </span>
            )}
            {estadoConfig.label}
          </div>

          <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center select-none">
              <span className="text-white font-bold text-sm">{initial}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-2 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-container-max mx-auto p-gutter space-y-lg">
          {actionError && (
            <div className="bg-error-container text-error px-4 py-3 rounded-xl border border-error/30 font-body-md text-body-md flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {actionError}
              <button onClick={() => setActionError(null)} className="ml-auto">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          <section className="flex flex-wrap gap-md items-center justify-between bg-surface-container-low p-md rounded-xl border border-outline-variant">
            <div className="flex gap-md items-center">
              {!isProcesoDeMejora && isPending && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-primary text-on-primary px-6 py-2.5 rounded-full flex items-center gap-2 font-label-lg text-label-lg hover:shadow-lg transition-all active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                    {actionLoading ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={actionLoading}
                    className="bg-surface border border-error text-error px-6 py-2.5 rounded-full flex items-center gap-2 font-label-lg text-label-lg hover:bg-error-container transition-all active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">cancel</span>
                    Negar
                  </button>
                </>
              )}
              {!isProcesoDeMejora && !isPending && (
                <span
                  className={`px-6 py-2.5 rounded-full font-label-lg text-label-lg opacity-60 border ${isApproved ? 'border-primary text-primary' : 'border-error text-error'}`}
                >
                  {estadoConfig.label}
                </span>
              )}
              {isProcesoDeMejora && (
                <span className="px-6 py-2.5 rounded-full font-label-lg text-label-lg border border-primary text-primary opacity-80">
                  {estadoConfig.label}
                </span>
              )}
            </div>

            <div className="flex gap-md">
              <button
                onClick={handlePrintPdf}
                disabled={printLoading}
                className="bg-surface border border-primary text-primary px-6 py-2.5 rounded-full flex items-center gap-2 font-label-lg text-label-lg hover:bg-surface-variant transition-all active:scale-95 disabled:opacity-60"
              >
                <span
                  className={`material-symbols-outlined ${printLoading ? 'animate-spin' : ''}`}
                >
                  {printLoading ? 'progress_activity' : 'print'}
                </span>
                {printLoading ? 'Preparando...' : 'Imprimir'}
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 space-y-lg">
              <Card
                header={{
                  bg: 'bg-primary-container text-on-primary-container',
                  icon: 'info',
                  title: 'Información de la Solicitud',
                }}
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                  <Field
                    label="Número de Solicitud"
                    value={solicitud?.requestNumber ?? '—'}
                    valueClass="font-semibold text-primary"
                  />
                  <Field
                    label="Tipo de Solicitud"
                    value={solicitud?.requestType?.replace(/_/g, ' ') ?? '—'}
                  />
                  <Field
                    label="Curso"
                    value={solicitud?.course?.replace(/_/g, ' ') ?? '—'}
                  />
                  <Field label="Paralelo" value={solicitud?.paralelo ?? '—'} />
                  <Field
                    label="Campus"
                    value={solicitud?.campus?.replace(/_/g, ' ') ?? '—'}
                  />
                  <Field
                    label="Fecha de Solicitud"
                    value={formatDate(solicitud?.createdAt)}
                  />
                  {solicitud?.payload?.subjects?.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-2">
                        Materias
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {solicitud.payload.subjects.map((sub) => (
                          <span
                            key={sub}
                            className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card
                header={{
                  bg: 'bg-surface-container-high text-on-surface',
                  icon: 'person',
                  title: 'Información del Estudiante',
                }}
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Nombre Completo"
                    value={solicitud?.studentName ?? '—'}
                  />
                </div>
              </Card>

              <Card
                header={{
                  bg: 'bg-surface-container-high text-on-surface',
                  icon: 'family_restroom',
                  title: 'Información del Representante',
                }}
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Nombre Completo"
                    value={solicitud?.representativeName ?? '—'}
                  />
                  <Field
                    label="Cédula"
                    value={solicitud?.representativeDni ?? '—'}
                  />
                </div>
              </Card>
            </div>

            <div className="space-y-lg">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm sticky top-24">
                <div className="bg-surface-container px-6 py-4 border-b border-outline-variant">
                  <h3 className="font-title-md text-title-md font-bold text-on-surface text-center">
                    Documento Oficial
                  </h3>
                </div>
                <div className="p-8 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container text-4xl">
                      picture_as_pdf
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center">
                    Genere la ficha de solicitud oficial firmada por la
                    institución.
                  </p>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={pdfLoading}
                    className="w-full bg-primary text-secondary-container hover:bg-primary-container py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md hover:shadow-lg disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined">
                      {pdfLoading ? 'progress_activity' : 'download'}
                    </span>
                    <span className="font-label-lg text-label-lg font-bold uppercase tracking-wide">
                      {pdfLoading ? 'Generando...' : 'Descargar PDF'}
                    </span>
                  </button>
                  <button
                    onClick={handlePrintPdf}
                    disabled={printLoading}
                    className="w-full bg-surface border border-primary text-primary hover:bg-surface-variant py-3 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-60"
                  >
                    <span
                      className={`material-symbols-outlined ${printLoading ? 'animate-spin' : ''}`}
                    >
                      {printLoading ? 'progress_activity' : 'print'}
                    </span>
                    <span className="font-label-lg text-label-lg font-bold uppercase tracking-wide">
                      {printLoading ? 'Preparando...' : 'Imprimir'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-4 px-gutter flex items-center justify-center bg-tertiary text-on-tertiary shrink-0">
        <p className="font-body-md text-body-md opacity-70">
          © 2026 Unidad Educativa Técnico Salesiano - Departamento de Sistemas.
        </p>
      </footer>

      {showModal && !isProcesoDeMejora && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
          <div
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl border border-outline-variant overflow-hidden">
            <div className="bg-error-container p-6 flex items-center justify-between">
              <h3 className="font-title-lg text-title-lg font-bold text-on-error-container">
                Negar Solicitud
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-black/5 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="font-body-md text-body-md text-on-surface">
                Indique el motivo del rechazo.
              </p>
              <textarea
                className="w-full rounded-lg border border-outline-variant p-3 focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md outline-none"
                placeholder="Ej: Documentación incompleta o no legible..."
                rows={4}
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
              />
              {actionError && (
                <p className="text-error font-label-sm text-label-sm">
                  {actionError}
                </p>
              )}
              <div className="flex justify-end gap-md pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-full font-label-lg text-label-lg hover:bg-surface-variant transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDeny}
                  disabled={actionLoading}
                  className="bg-error text-on-error px-6 py-2 rounded-full font-label-lg text-label-lg hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {actionLoading ? 'Procesando...' : 'Confirmar Negación'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ header, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      <div className={`px-6 py-4 flex items-center gap-3 ${header.bg}`}>
        <span className="material-symbols-outlined">{header.icon}</span>
        <h3 className="font-title-md text-title-md font-bold">
          {header.title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, valueClass = '' }) {
  return (
    <div>
      <p className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`font-body-md text-body-md ${valueClass}`}>{value}</p>
    </div>
  );
}
