import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardList, ArrowLeft, ArrowRight, InboxIcon, AlertTriangle } from 'lucide-react';
import { Navbar } from '../components/Navbar';

type CampusGroup = 'CC_MA' | 'YANUNCAY';

interface Tramite {
  id: string;
  label: string;
  description: string;
  badge?: string;
  icon: React.ElementType;
}

const tramitesPorCampus: Record<CampusGroup, Tramite[]> = {
  CC_MA: [
    {
      id: 'proceso_mejora',
      label: 'Evaluación de Mejora',
      description:
        'Solicita que tu representado rinda la evaluación de mejora del Tercer Trimestre en las asignaturas que requiera.',
      badge: 'Voluntario',
      icon: ClipboardList,
    },
  ],
  YANUNCAY: [],
};

const campusLabel: Record<CampusGroup, string> = {
  CC_MA: 'Campus Carlos Crespi / Maria Auxiliadora',
  YANUNCAY: 'Campus Yanuncay',
};

export function RequestsListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campus = (searchParams.get('campus') as CampusGroup) ?? 'CC_MA';
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const tramites = tramitesPorCampus[campus] ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Breadcrumb / back */}
        <button
          onClick={() => navigate('/solicitud')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Cambiar campus
        </button>

        <div className="mb-8">
          <p className="text-sm text-blue-700 font-medium mb-1">
            {campusLabel[campus]}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Solicitudes Disponibles
          </h1>
          <p className="text-slate-500">
            Seleccione el tipo de solicitud que desea realizar.
          </p>
        </div>

        {tramites.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <InboxIcon size={28} className="text-slate-400" />
            </div>
            <h2 className="font-semibold text-slate-700 text-lg mb-2">
              Sin solicitudes disponibles
            </h2>
            <p className="text-slate-400 text-sm max-w-sm">
              Por el momento no hay trámites habilitados para el Campus
              Yanuncay. Consulte con su institución para más información.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tramites.map((tramite) => {
              const Icon = tramite.icon;
              return (
                <button
                  key={tramite.id}
                  onClick={() =>
                    setPendingRoute(
                      `/solicitud/formulario?campus=${campus}&tipo=${tramite.id}`,
                    )
                  }
                  className="w-full text-left bg-white border-2 border-slate-200 hover:border-blue-700 hover:bg-blue-50 rounded-2xl p-6 flex items-center gap-6 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-blue-700 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
                    <Icon
                      size={24}
                      className="text-slate-600 group-hover:text-white transition-colors"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-slate-900">
                        {tramite.label}
                      </p>
                      {tramite.badge && (
                        <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                          {tramite.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {tramite.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-slate-300 group-hover:text-blue-700 transition-colors shrink-0"
                  />
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Modal de advertencia ── */}
      {pendingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Antes de continuar
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Recuerde que el proceso de evaluación de{' '}
              <strong>MEJORA</strong> es totalmente{' '}
              <strong>VOLUNTARIO</strong> y está a disposición de todos los
              estudiantes. Para evitar el desperdicio de papel o la sobrecarga
              de actividades al estudiante, si su representado{' '}
              <strong>no requiere</strong> la evaluación de MEJORA, por favor,{' '}
              <strong>no llene el formulario</strong>. En caso de requerir la
              Mejora, continúe con el registro.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(pendingRoute)}
                className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors"
              >
                Acepto, continuar
              </button>
              <button
                onClick={() => setPendingRoute(null)}
                className="flex-1 border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
