import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import NextAppointment from '@/components/NextAppointment';


const Resultados = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <motion.section 
          className="text-center space-y-4 mb-6"
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Servicios Médicos</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Accede a servicios médicos y comunícate con tu doctor.
          </p>
        </motion.section>

        {/* Mostrar la próxima cita si existe */}
        {user && <NextAppointment patientId={user.uid} />}

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Resto del contenido existente */}
          <motion.div
            className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Agendar una Cita</h3>
            <p className="text-sm text-gray-600 mb-4">Selecciona una fecha y hora para tu próxima consulta médica.</p>
            <button
              onClick={() => navigate('/reserva-citas')}
              className="bg-softGreen-600 text-white px-4 py-2 rounded-lg hover:bg-softGreen-700 transition"
            >
              Reservar Cita
            </button>
          </motion.div>

          <motion.div
            className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Enviar Mensaje</h3>
            <p className="text-sm text-gray-600 mb-4">Comunícate con tu médico mediante mensajes directos dentro de la plataforma.</p>
            <button
              onClick={() => navigate('/mensajes', { state: { newChat: true } })}
              className="bg-softGreen-600 text-white px-4 py-2 rounded-lg hover:bg-softGreen-700 transition"
            >
              Ir a Mensajes
            </button>
          </motion.div>
          {/* Resto de las tarjetas... */}
        </div>
      </div>
    </Layout>
  );
};

export default Resultados;
