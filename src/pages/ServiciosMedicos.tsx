import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Clock, UserCheck } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import AppointmentForm, { AppointmentFormData } from '@/components/AppointmentForm';
import NextAppointment from '@/components/NextAppointment';

const ServiciosMedicos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a patient
  if (!user || user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <motion.section 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-softGreen-100 text-softGreen-700 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Servicios Médicos
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Servicios Médicos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acceda a servicios médicos profesionales, programe citas y comuníquese directamente con su médico.
          </p>
        </motion.section>

        {/* Próxima cita */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <NextAppointment patientId={user.uid} />
          </motion.div>
        )}

        {/* Servicios principales */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reserva de Citas */}
          <motion.div
            className="glass-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Agendar Cita Médica</h3>
                <p className="text-gray-600">Programe su próxima consulta médica</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Consultas disponibles en horario de oficina</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <UserCheck className="h-4 w-4" />
                <span>Médicos especializados en dermatología</span>
              </div>
            </div>

            <AppointmentForm 
              patientId={user?.uid || ''}
              doctors={[
                { id: '1', name: 'Dr. Juan Pérez', specialty: 'Dermatología' },
                { id: '2', name: 'Dra. María López', specialty: 'Alergología' },
                { id: '3', name: 'Dr. Carlos Rodríguez', specialty: 'Dermatología Pediátrica' }
              ]}
              onSuccess={() => navigate('/servicios-medicos')} 
              onSubmit={function (data: AppointmentFormData): void {
                throw new Error('Function not implemented.');
              }} 
              onCancel={function (): void {
                throw new Error('Function not implemented.');
              }}            
            />
          </motion.div>

          {/* Mensajes */}
          <motion.div
            className="glass-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Comunicación con Médicos</h3>
                <p className="text-gray-600">Envíe mensajes directos a su médico</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>Comunicación directa y segura</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Respuesta en 24-48 horas</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/mensajes', { state: { newChat: true } })}
              className="w-full bg-softGreen-600 text-white px-6 py-3 rounded-lg hover:bg-softGreen-700 transition-colors duration-200 font-medium"
            >
              Ir a Mensajes
            </button>
          </motion.div>
        </div>

        {/* Información adicional */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Información Importante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Horarios de Atención</h4>
                <ul className="space-y-1">
                  <li>• Lunes a Viernes: 8:00 AM - 6:00 PM</li>
                  <li>• Sábados: 9:00 AM - 2:00 PM</li>
                  <li>• Emergencias: 24/7</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Servicios Disponibles</h4>
                <ul className="space-y-1">
                  <li>• Consultas dermatológicas</li>
                  <li>• Tratamiento de picor crónico</li>
                  <li>• Seguimiento de tratamientos</li>
                  <li>• Consultas de emergencia</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ServiciosMedicos; 