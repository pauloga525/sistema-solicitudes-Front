import { useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  User,
  GraduationCap,
  ClipboardList,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { FormFooter } from '../components/FormFooter';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const COURSES = [
  { value: '4to_Basica', label: '4to de Básica' },
  { value: '5to', label: '5to de Básica' },
  { value: '6to', label: '6to de Básica' },
  { value: '7mo', label: '7mo de Básica' },
];

const PARALELOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const SUBJECTS = [
  'Matemática',
  'Lengua y literatura',
  'Science',
  'Estudios Sociales',
  'Inglés',
  'ECA',
  'Computación',
  'Animación a la lectura',
  'Educación física',
  'ERE',
  'Razonamiento lógico Matemático',
  'Acompañamiento integral en el Aula',
];

interface FormData {
  representativeName: string;
  representativeDni: string;
  studentName: string;
  course: string;
  paralelo: string;
  subjects: string[];
  termsAccepted: boolean;
}

const emptyForm: FormData = {
  representativeName: '',
  representativeDni: '',
  studentName: '',
  course: '',
  paralelo: '',
  subjects: [],
  termsAccepted: false,
};

function onlyLetters(value: string): string {
  return value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '');
}

function toTitleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function validateFullName(value: string): boolean {
  const words = value.trim().split(/\s+/).filter((w) => w.length >= 2);
  return words.length >= 3;
}

function validateEcuadorianDni(dni: string): boolean {
  if (!/^\d{10}$/.test(dni)) return false;
  const province = parseInt(dni.substring(0, 2));
  if (province < 1 || province > 24) return false;
  if (parseInt(dni[2]) >= 6) return false;
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let val = parseInt(dni[i]) * coefficients[i];
    if (val >= 10) val -= 9;
    sum += val;
  }
  const check = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return check === parseInt(dni[9]);
}

type Stage = 'form' | 'preview' | 'success' | 'error';

export function FormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const campusParam = searchParams.get('campus') ?? 'CC_MA';
  const [form, setForm] = useState<FormData>(
    location.state?.formData
      ? { ...location.state.formData, termsAccepted: false }
      : emptyForm,
  );
  const [stage, setStage] = useState<Stage>('form');
  const [loading, setLoading] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [requestId, setRequestId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dniTouched, setDniTouched] = useState(false);
  const [repNameTouched, setRepNameTouched] = useState(false);
  const [studentNameTouched, setStudentNameTouched] = useState(false);

  const dniValid = validateEcuadorianDni(form.representativeDni);
  const dniError = dniTouched && !dniValid;

  const repNameValid = validateFullName(form.representativeName);
  const repNameError = repNameTouched && !repNameValid;

  const studentNameValid = validateFullName(form.studentName);
  const studentNameError = studentNameTouched && !studentNameValid;

  const campus = useMemo(() => {
    if (!form.course) return '';
    if (form.course === '4to_Basica') return 'Carlos Crespi';
    return 'María Auxiliadora';
  }, [form.course]);

  const toggleSubject = (subject: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const isFormValid =
    repNameValid &&
    dniValid &&
    studentNameValid &&
    form.course &&
    form.paralelo &&
    form.subjects.length > 0 &&
    form.termsAccepted;

  const handlePreview = () => {
    if (!isFormValid) return;
    navigate('/', { replace: true });
    navigate('/solicitud/preview', { state: { formData: form, campus } });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/requests`, {
        requestType: 'proceso_mejora',
        representativeName: form.representativeName.trim(),
        representativeDni: form.representativeDni.trim(),
        studentName: form.studentName.trim(),
        course: form.course,
        paralelo: form.paralelo,
        payload: { subjects: form.subjects },
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
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    window.open(`${API_URL}/requests/${requestId}/pdf`, '_blank');
  };

  // ── SUCCESS ──────────────────────────────────────────────
  if (stage === 'success') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-8 py-24 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            ¡Solicitud enviada!
          </h1>
          <p className="text-slate-500 mb-2">
            Tu solicitud fue registrada exitosamente.
          </p>
          <p className="text-blue-700 font-bold text-lg mb-8">
            N° {requestNumber}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDownloadPdf}
              className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
            >
              Descargar PDF
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-medium hover:bg-slate-100 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </main>
        <FormFooter />
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-2xl mx-auto px-8 py-24 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            No se pudo enviar
          </h1>
          <p className="text-slate-500 mb-8">{errorMsg}</p>
          <button
            onClick={() => setStage('form')}
            className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors"
          >
            Volver al formulario
          </button>
        </main>
        <FormFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-8 py-12">
        <button
          onClick={() => navigate(`/solicitud/tramites?campus=${campusParam}`)}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Formulario de Solicitud Institucional
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Complete la información requerida. Al finalizar podrá revisar los
            datos antes de enviar.
          </p>
        </div>

        <div className="space-y-6">
          {/* ── SECCIÓN 1: Representante ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <h2 className="font-semibold text-slate-900">
                Datos del Representante
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">
                  Nombres y Apellidos
                </label>
                <input
                  type="text"
                  value={form.representativeName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      representativeName: onlyLetters(e.target.value),
                    })
                  }
                  onBlur={() => {
                    setRepNameTouched(true);
                    setForm((prev) => ({
                      ...prev,
                      representativeName: toTitleCase(prev.representativeName),
                    }));
                  }}
                  placeholder="Ej: Juan Carlos Pérez López"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none ${
                    repNameError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {repNameError && (
                  <p className="text-red-500 text-xs mt-1">
                    Ingrese al menos un nombre y dos apellidos.
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">
                  Cédula de Identidad
                </label>
                <input
                  type="text"
                  value={form.representativeDni}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      representativeDni: e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 10),
                    })
                  }
                  onBlur={() => setDniTouched(true)}
                  placeholder="Ej: 0102030405"
                  maxLength={10}
                  inputMode="numeric"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none ${
                    dniError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {dniError && (
                  <p className="text-red-500 text-xs mt-1">
                    Cédula ecuatoriana inválida. Verifica el número.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── SECCIÓN 2: Estudiante ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center">
                <GraduationCap size={18} className="text-slate-900" />
              </div>
              <h2 className="font-semibold text-slate-900">
                Datos del Estudiante
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-slate-500 mb-1">
                  Nombres y Apellidos del Estudiante
                </label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      studentName: onlyLetters(e.target.value),
                    })
                  }
                  onBlur={() => {
                    setStudentNameTouched(true);
                    setForm((prev) => ({
                      ...prev,
                      studentName: toTitleCase(prev.studentName),
                    }));
                  }}
                  placeholder="Ej: María José Pérez López"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none ${
                    studentNameError
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {studentNameError && (
                  <p className="text-red-500 text-xs mt-1">
                    Ingrese al menos un nombre y dos apellidos.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Curso
                </label>
                <select
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {COURSES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Paralelo
                </label>
                <select
                  value={form.paralelo}
                  onChange={(e) =>
                    setForm({ ...form, paralelo: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {PARALELOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              {campus && (
                <div className="col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">
                    Campus (asignado automáticamente)
                  </label>
                  <div className="w-full border border-slate-100 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-600">
                    {campus}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SECCIÓN 3: Solicitud ── */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center">
                <ClipboardList size={18} className="text-white" />
              </div>
              <h2 className="font-semibold text-slate-900">
                Datos de la Solicitud
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-1">
                Evaluación de Mejora
              </p>
              <p>
                El proceso de evaluación de MEJORA es totalmente{' '}
                <strong>VOLUNTARIO</strong>.
              </p>
            </div>

            <p className="text-sm font-medium text-blue-700 mb-3">
              Asignaturas para Mejora:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SUBJECTS.map((subject) => (
                <label
                  key={subject}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={form.subjects.includes(subject)}
                    onChange={() => toggleSubject(subject)}
                    className="w-4 h-4 accent-blue-700"
                  />
                  <span className="text-sm text-slate-700">{subject}</span>
                </label>
              ))}
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) =>
                  setForm({ ...form, termsAccepted: e.target.checked })
                }
                className="w-4 h-4 accent-blue-700 mt-0.5"
              />
              <span className="text-sm text-slate-600">
                Acepto que la información proporcionada es verdadera y que mi
                representado se preparará adecuadamente para rendir las
                evaluaciones seleccionadas.
              </span>
            </label>
          </div>
        </div>

        {/* ── ACCIONES ── */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setForm(emptyForm)}
            className="border border-slate-300 text-slate-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Limpiar formulario
          </button>
          <button
            onClick={handlePreview}
            disabled={!isFormValid}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Vista previa y enviar
            <Send size={16} />
          </button>
        </div>
      </main>

      <FormFooter />

      {/* ── MODAL VISTA PREVIA ── */}
      {stage === 'preview' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-lg">
                Vista previa de la solicitud
              </h3>
              <button
                onClick={() => setStage('form')}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm mb-6">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-slate-700 mb-2">
                  Representante
                </p>
                <p>
                  <span className="text-slate-500">Nombre:</span>{' '}
                  {form.representativeName}
                </p>
                <p>
                  <span className="text-slate-500">Cédula:</span>{' '}
                  {form.representativeDni}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="font-semibold text-slate-700 mb-2">Estudiante</p>
                <p>
                  <span className="text-slate-500">Nombre:</span>{' '}
                  {form.studentName}
                </p>
                <p>
                  <span className="text-slate-500">Curso:</span> {form.course} —
                  Paralelo {form.paralelo}
                </p>
                <p>
                  <span className="text-slate-500">Campus:</span> {campus}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-semibold text-slate-700 mb-2">
                  Asignaturas seleccionadas ({form.subjects.length})
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {form.subjects.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStage('form')}
                className="flex-1 border border-slate-300 text-slate-600 py-2.5 rounded-full text-sm font-medium hover:bg-slate-50"
              >
                Editar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Enviando...' : 'Confirmar y enviar'}
                {!loading && <Send size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
