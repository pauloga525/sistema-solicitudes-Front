import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

type CampusGroup = 'CC_MA' | 'YANUNCAY';

const campusOptions = [
  {
    id: 'CC_MA' as CampusGroup,
    label: 'Campus Carlos Crespi / Maria Auxiliadora',
    description:
      'Sede administrativa principal enfocada en Ciencias Sociales y Humanidades.',
    icon: GraduationCap,
  },
  {
    id: 'YANUNCAY' as CampusGroup,
    label: 'Campus Yanuncay',
    description:
      'Centro de excelencia tecnológica y laboratorios de investigación avanzada.',
    icon: FlaskConical,
  },
];

export function CampusSelectionPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CampusGroup | null>(null);

  const handleContinuar = () => {
    if (!selected) return;
    navigate(`/solicitud/tramites?campus=${selected}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-8 py-16">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Selección de Campus
          </h1>
          <p className="text-slate-500">
            Por favor, seleccione el campus institucional correspondiente para
            continuar con su trámite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {campusOptions.map((campus) => {
            const Icon = campus.icon;
            const isSelected = selected === campus.id;

            return (
              <button
                key={campus.id}
                onClick={() => setSelected(campus.id)}
                className={`text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-700 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    isSelected ? 'bg-blue-700' : 'bg-slate-200'
                  }`}
                >
                  <Icon
                    size={24}
                    className={isSelected ? 'text-white' : 'text-slate-500'}
                  />
                </div>
                <p
                  className={`font-bold text-base mb-2 ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}
                >
                  {campus.label}
                </p>
                <p
                  className={`text-sm leading-relaxed ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}
                >
                  {campus.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinuar}
            disabled={!selected}
            className="inline-flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
