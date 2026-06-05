export default function Topbar({
  title,
  searchValue = '',
  onSearchChange,
  user,
  onLogout,
}) {
  const initial = (user?.username ?? 'A')[0].toUpperCase();

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50 h-16 flex items-center justify-between px-gutter shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="font-title-lg text-title-lg font-bold text-primary">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-body-md font-body-md w-full placeholder:text-outline outline-none"
            placeholder="Buscar por ID, Estudiante o Representante..."
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange?.('')}
              className="text-on-surface-variant hover:text-on-surface transition-colors ml-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

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
    </header>
  );
}
