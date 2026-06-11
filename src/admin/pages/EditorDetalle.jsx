import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { getConfig, updateCourse, updateSubject } from '../api/configService';
import { logout, getUser } from '../api/authService';

const CURSO_LABELS = {
  '1ro_Basica': '1ro de Básica',
  '2do_Basica': '2do de Básica',
  '3ro_Basica': '3ro de Básica',
  '4to_Basica': '4to de Básica',
  '5to':        '5to de Básica',
  '6to':        '6to de Básica',
  '7mo':        '7mo de Básica',
  '8vo':        '8vo de Básica',
  '9no':        '9no de Básica',
  '10mo':       '10mo de Básica',
  '1ro_Bach':   '1ro de Bachillerato',
  '2do_Bach':   '2do de Bachillerato',
  '3ro_Bach':   '3ro de Bachillerato',
};

const REQUEST_TYPE_LABELS = {
  proceso_mejora: 'Proceso de Mejora',
};

function Toggle({ active, loading, onChange }) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 shrink-0 ${
        active ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          active ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function ItemRow({ name, label, active, loading, onToggle }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-surface-container-low transition-colors">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-green-500' : 'bg-outline-variant'}`} />
        <span className={`font-body-md text-body-md ${active ? 'text-on-surface' : 'text-on-surface-variant'}`}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`font-label-sm text-label-sm ${active ? 'text-green-600' : 'text-on-surface-variant'}`}>
          {active ? 'Activo' : 'Inactivo'}
        </span>
        <Toggle active={active} loading={loading} onChange={() => onToggle(name, active)} />
      </div>
    </div>
  );
}

export default function EditorDetalle() {
  const { requestType } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null); // 'course:5to' | 'subject:Matemática'

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  useEffect(() => {
    setLoadingConfig(true);
    getConfig(requestType)
      .then(setConfig)
      .catch(() => setError('No se pudo cargar la configuración.'))
      .finally(() => setLoadingConfig(false));
  }, [requestType]);

  async function handleToggleCourse(name, currentActive) {
    const key = `course:${name}`;
    setToggling(key);
    try {
      const updated = await updateCourse(requestType, name, currentActive ? 0 : 1);
      setConfig(updated);
    } catch {
      setError('Error al actualizar el curso.');
    } finally {
      setToggling(null);
    }
  }

  async function handleToggleSubject(name, currentActive) {
    const key = `subject:${name}`;
    setToggling(key);
    try {
      const updated = await updateSubject(requestType, name, currentActive ? 0 : 1);
      setConfig(updated);
    } catch {
      setError('Error al actualizar la materia.');
    } finally {
      setToggling(null);
    }
  }

  const activeCourses = config?.courses?.filter((c) => c.active === 1).length ?? 0;
  const activeSubjects = config?.subjects?.filter((s) => s.active === 1).length ?? 0;

  return (
    <DashboardLayout
      title={REQUEST_TYPE_LABELS[requestType] ?? requestType}
      user={user}
      onLogout={handleLogout}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-lg py-2">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/admin/editor')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Editor de Solicitudes
          </button>

          {error && (
            <div className="bg-error-container text-error px-4 py-3 rounded-xl border border-error/30 font-body-md text-body-md flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
              <button onClick={() => setError(null)} className="ml-auto">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {loadingConfig ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
            </div>
          ) : (
            <>
              {/* ── Cursos ── */}
              <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="bg-primary-container px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-primary-container">school</span>
                    <h2 className="font-title-md text-title-md font-bold text-on-primary-container">
                      Cursos
                    </h2>
                  </div>
                  <span className="font-label-lg text-label-lg text-on-primary-container opacity-80">
                    {activeCourses} / {config?.courses?.length ?? 0} activos
                  </span>
                </div>
                <div className="p-4 divide-y divide-outline-variant/50">
                  {config?.courses?.map((course) => (
                    <ItemRow
                      key={course.name}
                      name={course.name}
                      label={CURSO_LABELS[course.name] ?? course.name}
                      active={course.active === 1}
                      loading={toggling === `course:${course.name}`}
                      onToggle={handleToggleCourse}
                    />
                  ))}
                </div>
              </section>

              {/* ── Materias ── */}
              <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface">menu_book</span>
                    <h2 className="font-title-md text-title-md font-bold text-on-surface">
                      Materias
                    </h2>
                  </div>
                  <span className="font-label-lg text-label-lg text-on-surface-variant">
                    {activeSubjects} / {config?.subjects?.length ?? 0} activas
                  </span>
                </div>
                <div className="p-4 divide-y divide-outline-variant/50">
                  {config?.subjects?.map((subject) => (
                    <ItemRow
                      key={subject.name}
                      name={subject.name}
                      label={subject.name}
                      active={subject.active === 1}
                      loading={toggling === `subject:${subject.name}`}
                      onToggle={handleToggleSubject}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
