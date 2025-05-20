import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthProps = {
  onLogin: (role: 'patient' | 'doctor') => void;
};

const AuthPage = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent, role: 'patient' | 'doctor') => {
    e.preventDefault();
    onLogin(role);
    navigate(role === 'patient' ? '/patient' : '/doctor');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md ${isLogin ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md ${!isLogin ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Registrarse
          </button>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={(e) => handleSubmit(e, 'patient')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {isLogin ? 'Iniciar como Paciente' : 'Registrarse como Paciente'}
            </button>
            <button
              onClick={(e) => handleSubmit(e, 'doctor')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              {isLogin ? 'Iniciar como Médico' : 'Registrarse como Médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;