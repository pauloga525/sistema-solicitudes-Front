import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { logout, getUser } from '../api/authService';

const SOLICITUD_TYPES = [
  {
    id: 'proceso_mejora',
    label: 'Proceso de Mejora',
    description: 'Gestiona los cursos y materias habilitados para la evaluación de mejora.',
    icon: 'edit_note',
    color: 'bg-primary-container text-on-primary-container',
    iconColor: 'text-primary',
  },
];

export default function EditorSolicitudes() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <DashboardLayout
      title="Editor de Solicitudes"
      user={user}
      onLogout={handleLogout}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4 py-2">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Selecciona un tipo de solicitud para configurar los cursos y materias disponibles.
          </p>

          {SOLICITUD_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => navigate(`/admin/editor/${type.id}`)}
              className="w-full text-left bg-surface border border-outline-variant rounded-xl p-6 flex items-center gap-5 hover:shadow-md hover:border-primary/40 transition-all group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${type.color}`}>
                <span className="material-symbols-outlined text-3xl">{type.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  {type.label}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  {type.description}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                arrow_forward_ios
              </span>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
