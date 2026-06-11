import { Link, useLocation } from 'react-router-dom';

export default function Topbar({
  title,
  searchValue = '',
  onSearchChange,
  user,
  onLogout,
}) {
  const { pathname } = useLocation();
  const initial = (user?.username ?? 'A')[0].toUpperCase();

  const navLinks = [
    { to: '/admin/dashboard', label: 'Solicitudes',        icon: 'list_alt'   },
    { to: '/admin/editor',    label: 'Editor de Solicitudes', icon: 'edit_note' },
  ];

  function isActive(to) {
    if (to === '/admin/dashboard') return pathname === '/admin/dashboard' || pathname.startsWith('/admin/solicitudes');
    return pathname.startsWith(to);
  }

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50 shrink-0 shadow-sm">
      {/* Fila principal */}
      <div className="h-16 flex items-center justify-between px-gutter">
        <h2 className="font-title-lg text-title-lg font-bold text-primary">
          {title}
        </h2>

        <div className="flex items-center gap-6">
          {onSearchChange && (
            <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline outline-none"
                placeholder="Buscar por ID, Estudiante o Representante..."
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchValue && (
                <button onClick={() => onSearchChange('')} className="text-on-surface-variant hover:text-on-surface transition-colors ml-1">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center select-none">
              <span className="text-white font-bold text-sm">{initial}</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 rounded-full hover:bg-error-container hover:text-error text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barra de navegación */}
      <nav className="flex items-center gap-1 px-gutter pb-2">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-label-lg text-label-lg transition-colors ${
              isActive(link.to)
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
