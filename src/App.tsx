import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { LandingPage } from './pages/LandingPage';
import { CampusSelectionPage } from './pages/CampusSelectionPage';
import { RequestsListPage } from './pages/RequestsListPage';
import { FormPage } from './pages/FormPage';
import { PreviewPage } from './pages/PreviewPage';
import AdminLogin from './admin/pages/Login';
import AdminSolicitudes from './admin/pages/Solicitudes';
import AdminDetalle from './admin/pages/DetalleSolicitud';
import AdminEditorSolicitudes from './admin/pages/EditorSolicitudes';
import AdminEditorDetalle from './admin/pages/EditorDetalle';
import AdminPrivateRoute from './admin/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Rutas públicas ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/solicitud" element={<CampusSelectionPage />} />
        <Route path="/solicitud/tramites" element={<RequestsListPage />} />
        <Route path="/solicitud/formulario" element={<FormPage />} />
        <Route path="/solicitud/preview" element={<PreviewPage />} />

        {/* ── Rutas admin ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminSolicitudes />} />
          <Route path="/admin/solicitudes/:id" element={<AdminDetalle />} />
          <Route path="/admin/editor" element={<AdminEditorSolicitudes />} />
          <Route path="/admin/editor/:requestType" element={<AdminEditorDetalle />} />
        </Route>
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
