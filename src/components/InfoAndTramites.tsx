import {
  CheckCircle,
  FileText,
  UserPlus,
  Edit3,
  List,
  BookOpen,
} from 'lucide-react';

const infoItems = [
  {
    title: 'Documento de Identidad',
    description: 'Tener a mano su documento de identidad y de su representado.',
  },
  {
    title: 'Correo Institucional',
    description: 'Debe tener acceso activo para recibir notificaciones.',
  },
  {
    title: 'Tiempos de Respuesta',
    description: 'Entre 24 y 72 horas hábiles según el tipo de trámite.',
  },
];

const tramites = [
  {
    icon: FileText,
    label: 'Certificados',
    description: 'Notas, conducta, matrícula y egreso.',
  },
  {
    icon: UserPlus,
    label: 'Matrículas',
    description: 'Renovación, extemporáneas y reingresos.',
  },
  {
    icon: Edit3,
    label: 'Cambios de información',
    description: 'Actualización de datos personales y contacto.',
  },
  {
    icon: List,
    label: 'Solicitudes académicas',
    description: 'Homologaciones, retiros y aplazamientos.',
  },
];

export function InfoAndTramites() {
  return (
    <section className="bg-slate-50 px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left — Info importante */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 w-full md:w-72 shrink-0 space-y-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CheckCircle size={20} className="text-amber-400" />
            Información Importante
          </h3>
          <div className="space-y-5">
            {infoItems.map((item, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-amber-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Tipos de trámites */}
        <div className="flex-1">
          <h3 className="font-bold text-xl text-slate-900 mb-6">
            Tipos de Trámites Disponibles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {tramites.map((tramite, i) => {
              const Icon = tramite.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4 items-start hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="bg-slate-100 rounded-lg p-2 shrink-0">
                    <Icon size={18} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {tramite.label}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {tramite.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4 items-start hover:shadow-sm transition-shadow cursor-pointer">
            <div className="bg-slate-100 rounded-lg p-2 shrink-0">
              <BookOpen size={18} className="text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                Documentos institucionales
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Manuales de convivencia, reglamentos y circulares oficiales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
