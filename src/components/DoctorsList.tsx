import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getAllDoctors } from '../services/userService';

interface Doctor {
  id: string;
  name: string;
  email: string;
}

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      setIsLoading(true);
      try {
        // Intentar obtener médicos de la base de datos
        const result = await getAllDoctors();
        
        if (result.success) {
          setDoctors(result.doctors);
        } else {
          // Si hay un error con la base de datos, intentar con localStorage
          const doctorsFromLocalStorage = getDoctorsFromLocalStorage();
          setDoctors(doctorsFromLocalStorage);
        }
      } catch (error) {
        console.error('Error al cargar médicos:', error);
        setError('Error al cargar la lista de médicos');
        // Intentar con localStorage como respaldo
        const doctorsFromLocalStorage = getDoctorsFromLocalStorage();
        setDoctors(doctorsFromLocalStorage);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDoctors();
  }, []);

  // Función para obtener médicos desde localStorage
  const getDoctorsFromLocalStorage = (): Doctor[] => {
    try {
      const doctors: Doctor[] = [];
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith('user_role_')) {
          const uid = key.replace('user_role_', '');
          const role = localStorage.getItem(key);
          
          if (role === 'doctor') {
            const name = localStorage.getItem(`user_name_${uid}`) || '';
            const surname = localStorage.getItem(`user_surname_${uid}`) || '';
            const email = localStorage.getItem(`user_email_${uid}`) || '';
            
            doctors.push({
              id: uid,
              name: `${name} ${surname}`.trim(),
              email: email
            });
          }
        }
      });
      
      return doctors;
    } catch (error) {
      console.error('Error al obtener médicos de localStorage:', error);
      return [];
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl mb-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buscar Médicos</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <p>No se encontraron médicos</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>ID: {doctor.id}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {doctor.email}
                    </span>
                  </div>
                </div>
                <div>
                  <Button
                    className="bg-softGreen-500 hover:bg-softGreen-600"
                  >
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;