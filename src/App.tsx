import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Index from "./pages/Index";
import Cuestionarios from "./pages/Cuestionarios";
import HistorialCuestionarios from "./pages/HistorialCuestionarios";
import ServiciosMedicos from "./pages/ServiciosMedicos";
import Resultados from "./pages/Resultados";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import DoctorResults from "./pages/DoctorResults";
import Mensajes from './pages/Mensajes';
import ReservaCitasPage from './pages/ReservaCitasPage';
import DoctorDashboard from './pages/DoctorDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reserva-citas" element={<ReservaCitasPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<RoleProtectedRoute allowedRole={'patient'}><Index /></RoleProtectedRoute>} />
            <Route path="/resultados" element={<RoleProtectedRoute allowedRole={'patient'}><Resultados /></RoleProtectedRoute>} />
            <Route path="/doctor-results" element={<RoleProtectedRoute allowedRole={'doctor'}><DoctorResults /></RoleProtectedRoute>} />
            <Route path="/mensajes" element={<Mensajes />} />
            <Route path="/doctor-dashboard" element={
              <RoleProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="/cuestionarios" element={<RoleProtectedRoute allowedRole={'patient'}><Cuestionarios /></RoleProtectedRoute>} />
            <Route path="/historial" element={<RoleProtectedRoute allowedRole={'patient'}><HistorialCuestionarios /></RoleProtectedRoute>} />
            <Route path="/servicios-medicos" element={<RoleProtectedRoute allowedRole={'patient'}><ServiciosMedicos /></RoleProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;