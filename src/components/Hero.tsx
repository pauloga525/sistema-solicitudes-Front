import { useState, useEffect } from 'react';
import { PlusCircle, Circle } from 'lucide-react';
import carlosImg from '../assets/carlos.png';
import mariaImg from '../assets/maria.png';
import yanu1Img from '../assets/yanu1.png';
import yanu2Img from '../assets/yanu2.png';

const SLIDES = [
  { src: carlosImg, label: 'Campus Carlos Crespi' },
  { src: mariaImg, label: 'Campus María Auxiliadora' },
  { src: yanu1Img, label: 'Campus Yanuncay' },
  { src: yanu2Img, label: 'Campus Yanuncay' },
];

const INTERVAL_MS = 2500;

interface HeroProps {
  onIniciar?: () => void;
}

export function Hero({ onIniciar }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1);    opacity: 0.4; }
          50%       { transform: scale(1.25); opacity: 0.75; }
        }
        .blob-1 { animation: breathe 5s ease-in-out infinite; }
        .blob-2 { animation: breathe 7s ease-in-out infinite 1.5s; }
        .blob-3 { animation: breathe 6s ease-in-out infinite 3s; }
      `}</style>

      <section className="relative overflow-hidden bg-slate-900 py-14 md:py-20">
        {/* ── Blobs de respiración ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob-1 absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="blob-2 absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
          <div className="blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-600/25 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto pl-2 md:pl-4 pr-4 md:pr-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* ── Card flotante izquierdo ── */}
          <div className="flex-[1.5] bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 text-sm font-medium px-4 py-1.5 rounded-full">
              <Circle size={10} fill="currentColor" />
              Plataforma Oficial Académica
            </span>

            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Sistema de Solicitudes Académicas
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Realice sus trámites académicos de forma rápida, segura y en
              línea. Centralizamos todos los procesos para facilitar su gestión
              estudiantil.
            </p>

            <button
              onClick={onIniciar}
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-amber-300 active:scale-95 transition-all"
            >
              <PlusCircle size={18} />
              Iniciar Solicitud
            </button>
          </div>

          {/* ── Carrusel derecho ── */}
          <div className="flex-1 w-full">
            <div
              className="relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{ aspectRatio: '16/9' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {SLIDES.map((slide, i) => (
                <img
                  key={i}
                  src={slide.src}
                  alt={slide.label}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}

              {/* Etiqueta campus */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3">
                <p className="text-white text-xs font-medium tracking-wide opacity-90">
                  {SLIDES[current].label}
                </p>
              </div>

              {/* Indicadores */}
              <div className="absolute bottom-3 right-4 flex gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Ir a imagen ${i + 1}`}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 20 : 8,
                      height: 8,
                      backgroundColor:
                        i === current ? '#ffffff' : 'rgba(255,255,255,0.45)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
