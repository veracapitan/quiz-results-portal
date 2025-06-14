import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Index from "./pages/Index";
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
            // Modifica estas líneas:
            <Route path="/" element={<RoleProtectedRoute allowedRole={'patient'}><Index /></RoleProtectedRoute>} />
            <Route path="/resultados" element={<RoleProtectedRoute allowedRole={'patient'}><Resultados /></RoleProtectedRoute>} />
            <Route path="/doctor-results" element={<RoleProtectedRoute allowedRole={'doctor'}><DoctorResults /></RoleProtectedRoute>} />
            <Route path="/mensajes" element={<RoleProtectedRoute allowedRole={'doctor'}><Mensajes /></RoleProtectedRoute>} />
            <Route path="/doctor-dashboard" element={
              <RoleProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </RoleProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;