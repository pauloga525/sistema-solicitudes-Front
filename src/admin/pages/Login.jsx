import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../api/authService';
import logoCrest from '../../assets/logo-crest.png';
import carlosImg from '../../assets/carlos.png';
import mariaImg from '../../assets/maria.png';
import yanu1Img from '../../assets/yanu1.png';
import yanu2Img from '../../assets/yanu2.png';

const SLIDES = [
  { src: carlosImg,  label: 'Campus Carlos Crespi' },
  { src: mariaImg,   label: 'Campus María Auxiliadora' },
  { src: yanu1Img,   label: 'Campus Yanuncay' },
  { src: yanu2Img,   label: 'Campus Yanuncay' },
];
const INTERVAL_MS = 5000;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated()) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message ?? 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <img src={logoCrest} alt="UETS" className="h-24 w-auto" />
          <span className="font-title-lg text-title-lg font-bold text-amber-400">
            
          </span>
        
        </div>
          
        
      </header>

      <main className="flex-grow flex flex-col md:flex-row h-screen overflow-hidden">
        <section className="hidden md:flex md:w-3/5 lg:w-2/3 relative items-center justify-center bg-primary overflow-hidden">
          {/* Carrusel de imágenes */}
          {SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.label}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: i === current ? 0.3 : 0 }}
            />
          ))}
          {/* Etiqueta campus */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-6 pt-8 pb-4 z-10">
            <p className="text-white text-xs font-medium tracking-wide opacity-90">
              {SLIDES[current].label}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 via-primary/30 to-transparent" />
          <div className="relative z-10 px-gutter max-w-2xl">
            <h1 className="font-display-lg text-display-lg text-white mb-md">
              Administración de Solicitudes Académicas
            </h1>
            <p className="font-body-lg text-body-lg text-primary-fixed opacity-90 max-w-xl">
              Acceda al portal administrativo de la UETS para gestionar solicitudes académicas institucionales.
            </p>
            <div className="mt-xl flex gap-md">
              <Badge icon="verified_user" text="Acceso Encriptado" />
            </div>
          </div>
        </section>

        <section className="w-full md:w-2/5 lg:w-1/3 h-full flex flex-col justify-center px-8 md:px-12 bg-surface relative">
          <div className="bg-pattern absolute inset-0 opacity-50" />
          <div className="relative z-10 w-full max-w-sm mx-auto">
            <div className="mb-xl">
              <h2 className="font-headline-lg text-headline-lg font-bold text-primary mb-xs">
                Portal Administrativo
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Ingrese sus credenciales para continuar.
              </p>
            </div>

            <form className="space-y-lg" onSubmit={handleSubmit}>
              <div className="group relative">
                <label
                  htmlFor="usuario"
                  className="block text-label-lg font-label-lg text-on-surface-variant mb-1 group-focus-within:text-primary transition-colors"
                >
                  Usuario
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    person
                  </span>
                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    required
                    placeholder="ej. admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:bg-surface-container-high transition-all outline-none rounded-t-lg"
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="password"
                  className="block text-label-lg font-label-lg text-on-surface-variant mb-1 group-focus-within:text-primary transition-colors"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:bg-surface-container-high transition-all outline-none rounded-t-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-error-container text-error px-4 py-3 rounded-lg border border-error/30 font-body-md text-body-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  {error}
                </div>
              )}

              <div className="pt-4 space-y-md">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-title-md text-title-md rounded-full shadow-lg hover:bg-primary-container active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-md animate-spin">
                        progress_activity
                      </span>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <span className="material-symbols-outlined text-md">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
      <span
        className="material-symbols-outlined text-primary-fixed-dim text-sm"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span className="text-white text-label-lg font-label-lg">{text}</span>
    </div>
  );
}
