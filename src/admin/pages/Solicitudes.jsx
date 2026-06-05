import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import SolicitudesTable from '../components/SolicitudesTable';
import { getRequests, getErrorMessage } from '../api/requestsService';
import { logout, getUser } from '../api/authService';
import { CAMPUS, COURSE, REQUEST_STATUS } from '../api/config';

const CURSO_LABELS = {
  '1ro_Basica': '1ro Básica',
  '2do_Basica': '2do Básica',
  '3ro_Basica': '3ro Básica',
  '4to_Basica': '4to Básica',
  '5to': '5to',
  '6to': '6to',
  '7mo': '7mo',
  '8vo': '8vo',
  '9no': '9no',
  '10mo': '10mo',
  '1ro_Bach': '1ro Bach',
  '2do_Bach': '2do Bach',
  '3ro_Bach': '3ro Bach',
};

const EMPTY_FILTERS = { status: '', campus: '', course: '', search: '' };

export default function Solicitudes() {
  const navigate = useNavigate();
  const user = getUser();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef(null);

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  const fetchSolicitudes = useCallback(async (f) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequests(f);
      setSolicitudes(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolicitudes(EMPTY_FILTERS);
  }, [fetchSolicitudes]);

  function handleSearchChange(value) {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...activeFilters, search: value };
      setActiveFilters(newFilters);
      fetchSolicitudes(newFilters);
    }, 500);
  }

  function handleApply() {
    const merged = { ...filters, search: searchInput };
    setActiveFilters(merged);
    fetchSolicitudes(merged);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    setActiveFilters(EMPTY_FILTERS);
    setSearchInput('');
    fetchSolicitudes(EMPTY_FILTERS);
  }

  return (
    <DashboardLayout
      title="Gestión de Solicitudes"
      searchValue={searchInput}
      onSearchChange={handleSearchChange}
      user={user}
      onLogout={handleLogout}
    >
      <section className="bg-surface p-4 rounded-xl border border-outline-variant shadow-sm shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">filter_alt</span>
            <span className="font-label-lg text-label-lg font-bold">
              Filtros
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
            <select
              value={filters.campus}
              onChange={(e) =>
                setFilters((f) => ({ ...f, campus: e.target.value }))
              }
              className="bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">Campus: Todos</option>
              {Object.values(CAMPUS).map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={filters.course}
              onChange={(e) =>
                setFilters((f) => ({ ...f, course: e.target.value }))
              }
              className="bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">Curso: Todos</option>
              {COURSE.map((c) => (
                <option key={c} value={c}>
                  {CURSO_LABELS[c] ?? c}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              className="bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">Estado: Todos</option>
              {Object.values(REQUEST_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex-1 lg:flex-none bg-surface-container-highest text-on-surface-variant font-label-lg text-label-lg px-6 py-2 rounded-lg hover:bg-outline-variant transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 lg:flex-none bg-primary text-on-primary font-label-lg text-label-lg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Aplicar
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="bg-error-container text-error px-4 py-3 rounded-xl border border-error/30 font-body-md text-body-md flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
          <button
            onClick={() => fetchSolicitudes(activeFilters)}
            className="ml-auto underline text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      <SolicitudesTable
        solicitudes={solicitudes}
        loading={loading}
        onVerDetalle={(id) => navigate(`/admin/solicitudes/${id}`)}
        onRefresh={() => fetchSolicitudes(activeFilters)}
      />
    </DashboardLayout>
  );
}
