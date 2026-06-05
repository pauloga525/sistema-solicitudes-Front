import { useState } from 'react';
import {
  updateRequestStatus,
  printRequestPdf,
  getErrorMessage,
} from '../api/requestsService';
import { REQUEST_STATUS } from '../api/config';

const estadoStyles = {
  pendiente: 'bg-secondary-container text-on-secondary-container',
  aprobado: 'bg-green-100 text-green-700',
  rechazado: 'bg-error-container text-error',
  en_revision: 'bg-tertiary-fixed text-tertiary',
  cancelado: 'bg-surface-container-high text-on-surface-variant',
};

const estadoDotStyles = {
  pendiente: 'bg-secondary',
  aprobado: 'bg-green-600',
  rechazado: 'bg-error',
  en_revision: 'bg-tertiary',
  cancelado: 'bg-outline',
};

const estadoLabels = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  en_revision: 'En Revisión',
  cancelado: 'Cancelado',
};

function getAcciones(status, requestType) {
  if (requestType === 'proceso_mejora') {
    return ['ver', 'imprimir'];
  }
  if (status === 'pendiente' || status === 'en_revision') {
    return ['ver', 'aprobar', 'negar'];
  }
  if (status === 'aprobado') return ['ver', 'imprimir'];
  if (status === 'rechazado') return ['ver'];
  return ['ver'];
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function DenyModal({ onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-md">
      <div
        className="absolute inset-0 bg-on-background/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl border border-outline-variant overflow-hidden">
        <div className="bg-error-container p-6 flex items-center justify-between">
          <h3 className="font-title-lg text-title-lg font-bold text-on-error-container">
            Negar Solicitud
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-black/5 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="font-body-md text-body-md text-on-surface">
            Indique el motivo del rechazo. Este texto quedará registrado.
          </p>
          <textarea
            className="w-full rounded-lg border border-outline-variant p-3 focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md outline-none"
            placeholder="Ej: Documentación incompleta..."
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-md pt-2">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-full font-label-lg text-label-lg hover:bg-surface-variant transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={loading || !reason.trim()}
              className="bg-error text-on-error px-6 py-2 rounded-full font-label-lg text-label-lg hover:shadow-lg transition-all disabled:opacity-60"
            >
              {loading ? 'Procesando...' : 'Confirmar Negación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SolicitudesTable({
  solicitudes = [],
  loading = false,
  onVerDetalle,
  onRefresh,
}) {
  const [actionLoading, setActionLoading] = useState(null);
  const [printLoading, setPrintLoading] = useState(null);
  const [denyTarget, setDenyTarget] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function handleAprobar(e, id) {
    e.stopPropagation();
    setActionLoading(id);
    setActionError(null);
    try {
      await updateRequestStatus(id, REQUEST_STATUS.APROBADO);
      onRefresh?.();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirmDeny() {
    if (!denyTarget) return;
    setActionLoading(denyTarget);
    try {
      await updateRequestStatus(denyTarget, REQUEST_STATUS.RECHAZADO);
      setDenyTarget(null);
      onRefresh?.();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handlePrint(e, id) {
    e.stopPropagation();
    setPrintLoading(id);
    setActionError(null);
    try {
      await printRequestPdf(id);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setPrintLoading(null);
    }
  }

  if (loading) {
    return (
      <section className="flex-1 bg-surface rounded-xl border border-outline-variant shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl animate-spin">
            progress_activity
          </span>
          <p className="font-body-md text-body-md">Cargando solicitudes...</p>
        </div>
      </section>
    );
  }

  if (solicitudes.length === 0) {
    return (
      <section className="flex-1 bg-surface rounded-xl border border-outline-variant shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl">inbox</span>
          <p className="font-body-md text-body-md">
            No se encontraron solicitudes
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {actionError && (
        <div className="bg-error-container text-error px-4 py-2 rounded-xl border border-error/30 font-body-md text-body-md flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-sm">error</span>
          {actionError}
          <button onClick={() => setActionError(null)} className="ml-auto">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <section className="flex-1 bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-10" style={{ fontSize: '11px' }}>
              <tr>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  N° Solicitud
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  Detalles Académicos
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {solicitudes.map((s) => {
                const acciones = getAcciones(s.status, s.requestType);
                const isWorking = actionLoading === s._id;
                const isPrinting = printLoading === s._id;
                return (
                  <tr
                    key={s._id}
                    onClick={() => onVerDetalle(s._id)}
                    className="hover:bg-surface-container-lowest transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5 font-body-md text-body-md font-medium text-primary">
                      {s.requestNumber ?? s._id?.slice(-6)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-label-lg text-label-lg text-on-surface group-hover:text-primary transition-colors">
                        {s.studentName}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-body-md text-body-md">
                        {s.campus?.replace(/_/g, ' ') ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-body-md text-body-md">
                          {s.course?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">
                          Paralelo {s.paralelo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-body-md text-body-md text-on-surface-variant">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${estadoStyles[s.status] ?? ''}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${estadoDotStyles[s.status] ?? ''}`}
                        />
                        {estadoLabels[s.status] ?? s.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {acciones.includes('ver') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onVerDetalle(s._id);
                            }}
                            className="p-2 hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors text-on-surface-variant"
                            title="Ver Detalles"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              visibility
                            </span>
                          </button>
                        )}
                        {acciones.includes('aprobar') && (
                          <button
                            onClick={(e) => handleAprobar(e, s._id)}
                            disabled={isWorking}
                            className="p-2 hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors text-on-surface-variant disabled:opacity-50"
                            title="Aprobar"
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] ${isWorking ? 'animate-spin' : ''}`}
                            >
                              {isWorking ? 'progress_activity' : 'check'}
                            </span>
                          </button>
                        )}
                        {acciones.includes('negar') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDenyTarget(s._id);
                            }}
                            disabled={isWorking}
                            className="p-2 hover:bg-error-container hover:text-error rounded-lg transition-colors text-on-surface-variant disabled:opacity-50"
                            title="Negar"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              close
                            </span>
                          </button>
                        )}
                        {acciones.includes('imprimir') && (
                          <>
                            <div className="w-px h-6 bg-outline-variant mx-1" />
                            <button
                              onClick={(e) => handlePrint(e, s._id)}
                              disabled={isPrinting}
                              className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant disabled:opacity-50"
                              title="Imprimir"
                            >
                              <span
                                className={`material-symbols-outlined text-[20px] ${isPrinting ? 'animate-spin' : ''}`}
                              >
                                {isPrinting ? 'progress_activity' : 'print'}
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-t border-outline-variant shrink-0">
          <span className="font-body-md text-body-md text-on-surface-variant">
            <span className="font-bold text-on-surface">{solicitudes.length}</span>{' '}
            solicitudes encontradas
          </span>
        </div>
      </section>

      {denyTarget && (
        <DenyModal
          loading={actionLoading === denyTarget}
          onConfirm={handleConfirmDeny}
          onCancel={() => setDenyTarget(null)}
        />
      )}
    </>
  );
}
