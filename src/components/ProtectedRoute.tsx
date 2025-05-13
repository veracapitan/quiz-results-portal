
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, error } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowTimeout(true);
      }
    }, 5000); // Show timeout message after 5 seconds

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowTimeout(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500 mb-4"></div>
        <div className="text-center">
          {showTimeout && (
            <>
              <p className="text-gray-600 text-sm mb-4">La carga está tomando más tiempo de lo esperado.</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="text-sm"
                disabled={retryCount >= 3}
              >
                Reintentar
              </Button>
              {retryCount >= 3 && (
                <p className="text-red-500 text-sm mt-2">
                  Hay problemas para cargar la aplicación. Por favor, inténtelo más tarde.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect doctors to their dedicated interface
  if (user.role === 'doctor' && window.location.pathname === '/') {
    return <Navigate to="/doctor-results" />;
  }

  // Redirect patients away from doctor routes
  if (user.role === 'patient' && (window.location.pathname.includes('/doctor') || window.location.pathname === '/doctor-results')) {
    return <Navigate to="/" />;
  }
  
  // Redirect doctors away from patient routes
  if (user.role === 'doctor' && (window.location.pathname === '/resultados' || window.location.pathname === '/')) {
    return <Navigate to="/doctor-results" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
