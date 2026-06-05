import { useNavigate } from 'react-router-dom';
import logoCrest from '../assets/logo-crest.png';

interface NavbarProps {
  onIniciar?: () => void;
}

export function Navbar({ onIniciar }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img
          src={logoCrest}
          alt="Escudo UETS"
          className="h-12 w-12 rounded-full object-cover"
        />
        <span className="font-semibold text-slate-900 text-lg">
          UETS - Sistema de Solicitudes
        </span>
      </button>
      {onIniciar && (
        <button
          onClick={onIniciar}
          className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Iniciar solicitud
        </button>
      )}
    </nav>
  );
}
