import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthProps = {
  onLogin: () => void;
};

const AuthPage = ({ onLogin }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent, role: 'patient' | 'doctor') => {
    e.preventDefault();
  
    let uid: string;
    let finalName: string;
    let finalSurname: string;
  
    if (isLogin) {
      // Buscar el UID guardado previamente por email
      const savedUsers = Object.keys(localStorage).filter(k => k.startsWith("user_email_"));
      const found = savedUsers.find(k => localStorage.getItem(k) === email);
  
      if (!found) {
        alert("Usuario no encontrado. Regístrate primero.");
        return;
      }
  
      uid = found.replace("user_email_", "");
      finalName = localStorage.getItem(`user_name_${uid}`) || "";
      finalSurname = localStorage.getItem(`user_surname_${uid}`) || "";
  
      // Log para depurar
      console.log("LOGIN:", { uid, finalName, finalSurname });
  
    } else {
      // Registro nuevo
      uid = crypto.randomUUID();
      finalName = name;
      finalSurname = surname;
  
      // Guardar datos de usuario
      localStorage.setItem(`user_email_${uid}`, email);
      localStorage.setItem(`user_name_${uid}`, name);
      localStorage.setItem(`user_surname_${uid}`, surname);
      localStorage.setItem(`user_role_${uid}`, role);
  
      console.log("REGISTRO:", { uid, finalName, finalSurname });
    }
  
    // Guardar el usuario actual en sesión
    localStorage.setItem("current_user_id", uid);
    localStorage.setItem("current_user_role", role);
    localStorage.setItem("current_user_name", finalName);
    localStorage.setItem("current_user_surname", finalSurname);
  
    // Validar que se hayan guardado bien
    console.log("CURRENT:", {
      id: localStorage.getItem("current_user_id"),
      role: localStorage.getItem("current_user_role"),
      name: localStorage.getItem("current_user_name"),
      surname: localStorage.getItem("current_user_surname"),
    });
  
    onLogin();
    navigate(role === "patient" ? "/patient" : "/doctor");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={() => setIsLogin(true)} className={`px-4 py-2 rounded-md ${isLogin ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Iniciar Sesión</button>
          <button onClick={() => setIsLogin(false)} className={`px-4 py-2 rounded-md ${!isLogin ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Registrarse</button>
        </div>

        <form className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input type="text" required value={surname} onChange={e => setSurname(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div className="flex space-x-4">
            <button onClick={(e) => handleSubmit(e, 'patient')} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">Paciente</button>
            <button onClick={(e) => handleSubmit(e, 'doctor')} className="w-full py-2 px-4 bg-green-600 text-white rounded-md">Médico</button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default AuthPage;