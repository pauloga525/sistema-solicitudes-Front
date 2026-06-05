import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Printer,
  PlusCircle,
  Shield,
  Home,
} from 'lucide-react';
import axios from 'axios';
import { FormFooter } from '../components/FormFooter';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type Stage = 'loading' | 'preview' | 'submitting' | 'success' | 'error';

export function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state ?? {};

  const [stage, setStage] = useState<Stage>('loading');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [requestNumber, setRequestNumber] = useState('');
  const [requestId, setRequestId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/solicitud');
      return;
    }

    let objectUrl: string;

    axios
      .post(
        `${API_URL}/requests/preview`,
        {
          requestType: 'proceso_mejora',
          representativeName: formData.representativeName.trim(),
          representativeDni: formData.representativeDni.trim(),
          studentName: formData.studentName.trim(),
          course: formData.course,
          paralelo: formData.paralelo,
          payload: { subjects: formData.subjects },
        },
        { responseType: 'blob' },
      )
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setStage('preview');
      })
      .catch(() => {
        setErrorMsg('No se pudo generar la vista previa.');
        setStage('error');
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleSubmit = async () => {
    if (stage === 'submitting') return;
    setStage('submitting');
    try {
      const { data } = await axios.post(`${API_URL}/requests`, {
        requestType: 'proceso_mejora',
        representativeName: formData.representativeName.trim(),
        representativeDni: formData.representativeDni.trim(),
        studentName: formData.studentName.trim(),
        course: formData.course,
        paralelo: formData.paralelo,
        payload: { subjects: formData.subjects },
      });
      setRequestNumber(data.requestNumber);
      setRequestId(data._id);
      setStage('success');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setErrorMsg(
          err.response?.data?.message ?? 'Error al enviar la solicitud.',
        );
      } else {
        setErrorMsg('Error inesperado. Intente nuevamente.');
      }
      setStage('error');
    }
  };

  const handleModificar = () => {
    navigate('/solicitud/formulario', { state: { formData } });
  };

  // ── SUCCESS ──────────────────────────────────────────────
  if (stage === 'success') {
    const fecha = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const handleDescargar = () =>
      window.open(`${API_URL}/requests/${requestId}/pdf`, '_blank');
    const handleImprimir = async () => {
      const res = await axios.get(`${API_URL}/requests/${requestId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const w = window.open(url);
      if (w)
        setTimeout(() => {
          w.print();
          URL.revokeObjectURL(url);
        }, 1500);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          {/* Partículas flotantes en toda la pantalla */}
          {[
            {
              style: { top: '8%', left: '5%' },
              size: 12,
              color: '#0f172a',
              anim: 'float-1',
              delay: '0s',
            },
            {
              style: { top: '15%', left: '18%' },
              size: 8,
              color: '#f59e0b',
              anim: 'float-3',
              delay: '0.5s',
            },
            {
              style: { top: '5%', left: '40%' },
              size: 10,
              color: '#0f172a',
              anim: 'float-2',
              delay: '1s',
            },
            {
              style: { top: '20%', left: '60%' },
              size: 7,
              color: '#f59e0b',
              anim: 'float-4',
              delay: '0.3s',
            },
            {
              style: { top: '10%', right: '8%' },
              size: 12,
              color: '#f59e0b',
              anim: 'float-1',
              delay: '1.5s',
            },
            {
              style: { top: '30%', right: '5%' },
              size: 8,
              color: '#0f172a',
              anim: 'float-3',
              delay: '0.8s',
            },
            {
              style: { top: '45%', left: '3%' },
              size: 10,
              color: '#f59e0b',
              anim: 'float-2',
              delay: '0.2s',
            },
            {
              style: { top: '55%', right: '4%' },
              size: 8,
              color: '#0f172a',
              anim: 'float-4',
              delay: '1.2s',
            },
            {
              style: { top: '70%', left: '10%' },
              size: 12,
              color: '#0f172a',
              anim: 'float-1',
              delay: '0.7s',
            },
            {
              style: { top: '75%', left: '30%' },
              size: 7,
              color: '#f59e0b',
              anim: 'float-3',
              delay: '0s',
            },
            {
              style: { top: '65%', right: '15%' },
              size: 10,
              color: '#f59e0b',
              anim: 'float-2',
              delay: '1.8s',
            },
            {
              style: { top: '85%', right: '6%' },
              size: 8,
              color: '#0f172a',
              anim: 'float-4',
              delay: '0.4s',
            },
            {
              style: { top: '90%', left: '50%' },
              size: 10,
              color: '#f59e0b',
              anim: 'float-1',
              delay: '1s',
            },
            {
              style: { top: '40%', left: '45%' },
              size: 7,
              color: '#0f172a',
              anim: 'float-3',
              delay: '2s',
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`particle ${p.anim}`}
              style={{
                ...p.style,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                animationDelay: p.delay,
                zIndex: 0,
              }}
            />
          ))}

          <div className="relative w-full max-w-xl" style={{ zIndex: 1 }}>
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-xl px-10 py-10 text-center">
              {/* Icono */}
              <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle
                  size={40}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Solicitud enviada correctamente
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Tu trámite ha sido procesado por el sistema institucional.
                Guarda o imprime tu comprobante en formato PDF.
              </p>

              {/* Info boxes */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1">
                    ID de Solicitud
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {requestNumber}
                  </p>
                </div>
                <div className="flex-1 border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-1">
                    Fecha de Envío
                  </p>
                  <p className="font-bold text-slate-900 text-lg capitalize">
                    {fecha}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleDescargar}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
                >
                  <Download size={16} />
                  Descargar PDF
                </button>
                <button
                  onClick={handleImprimir}
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 py-3 rounded-full font-medium hover:bg-slate-50 transition-colors"
                >
                  <Printer size={16} />
                  Imprimir Solicitud
                </button>
              </div>

              <div className="border-t border-slate-100 pt-6 flex items-center justify-center gap-8">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  <Home size={16} />
                  Volver al inicio
                </button>
                <button
                  onClick={() => navigate('/solicitud')}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm transition-colors"
                >
                  <PlusCircle size={16} />
                  Realizar nueva solicitud
                </button>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield size={12} /> Conexión cifrada de alta seguridad
                </span>
                <span>Ref: {requestId.slice(-10).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        <FormFooter />
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-8 py-24">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Error</h1>
            <p className="text-slate-500 mb-8">{errorMsg}</p>
            <button
              onClick={handleModificar}
              className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
            >
              Volver al formulario
            </button>
          </div>
        </div>
        <FormFooter />
      </div>
    );
  }

  // ── LOADING / PREVIEW ─────────────────────────────────────
  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      {/* PDF iframe */}
      <div className="flex-1 bg-gray-200 relative">
        {stage === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 size={32} className="animate-spin" />
            <p className="text-sm">Generando vista previa...</p>
          </div>
        )}
        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0"
            title="Vista previa de solicitud"
          />
        )}
      </div>

      {/* Barra de acciones fija */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <p className="text-slate-500 text-sm hidden sm:block">
            Revise los datos antes de confirmar
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleModificar}
              disabled={stage === 'submitting'}
              className="border border-slate-300 text-slate-700 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Modificar
            </button>
            <button
              onClick={handleSubmit}
              disabled={stage === 'submitting' || stage === 'loading'}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {stage === 'submitting' ? 'Enviando...' : 'Confirmar y Enviar'}
              {stage !== 'submitting' && <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
