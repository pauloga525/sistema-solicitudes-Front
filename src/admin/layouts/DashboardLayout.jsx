import Topbar from '../components/Topbar';

export default function DashboardLayout({
  title,
  children,
  searchValue,
  onSearchChange,
  user,
  onLogout,
}) {
  return (
    <div className="bg-background text-on-background flex h-screen overflow-hidden">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar
          title={title}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          user={user}
          onLogout={onLogout}
        />

        <div className="flex-1 flex flex-col p-gutter gap-lg overflow-hidden">
          {children}
        </div>

        <footer className="w-full py-4 px-gutter flex items-center justify-center bg-tertiary text-on-tertiary shrink-0 border-t border-white/10">
          <p className="font-body-md text-body-md opacity-70">
            © 2026 Unidad Educativa Técnico Salesiano - Departamento de Sistemas.
          </p>
        </footer>
      </main>
    </div>
  );
}
