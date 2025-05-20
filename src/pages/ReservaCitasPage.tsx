import React from 'react';
import AppointmentsComponent from '../components/AppointmentsComponent';

const ReservaCitasPage = () => {
  // En una aplicación real, el patientId vendría de la autenticación
  const patientId = '12345'; 

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Reserva de Citas Médicas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <AppointmentsComponent patientId={patientId} />
      </div>
    </div>
  );
};

export default ReservaCitasPage;