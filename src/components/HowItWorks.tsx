import {
  MapPin,
  IdCard,
  ClipboardCheck,
  FileDown,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    label: '1. Seleccionar Campus',
    description: 'Elige la sede donde te encuentras matriculado actualmente.',
    accent: false,
  },
  {
    icon: IdCard,
    label: '2. Ingresar ID',
    description: 'Ingresa tu número de identificación estudiantil único.',
    accent: false,
  },
  {
    icon: ClipboardCheck,
    label: '3. Revisar Info',
    description: 'Valida que todos tus datos personales sean correctos.',
    accent: false,
  },
  {
    icon: FileDown,
    label: '4. Enviar y Descargar',
    description: 'Finaliza el trámite y obtén tu comprobante en formato PDF.',
    accent: true,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            ¿Cómo funciona el proceso?
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex md:flex-col items-center gap-4 w-full md:flex-1"
              >
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col items-center text-center gap-3 flex-1 w-full">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${step.accent ? 'bg-amber-400' : 'bg-slate-100'}`}
                  >
                    <Icon
                      size={22}
                      className={
                        step.accent ? 'text-slate-900' : 'text-slate-600'
                      }
                    />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {step.label}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    className="text-slate-300 shrink-0 rotate-90 md:rotate-0"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
