import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppointmentFormWithCalendar from '@/components/AppointmentFormWithCalendar';

const ReservaCitasPage = () => {
  const { user } = useAuth();
  // En una aplicación real, el patientId vendría de la autenticación
  const patientId = user?.uid || '12345';
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Reserva de Citas Médicas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-gray-600 mb-2">Selecciona el día y la hora para tu cita médica:</p>
          <ul className="text-sm text-gray-500 list-disc pl-5 mb-4">
            <li>Lunes a viernes: 8:00 a 21:00</li>
            <li>Sábados y domingos: 8:00 a 14:00</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <AppointmentFormWithCalendar patientId={patientId} />
        </div>
      </div>
    </div>
  );
};

export default ReservaCitasPage;