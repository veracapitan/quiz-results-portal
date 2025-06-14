import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppointmentData {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: Date;
  status: string;
  formattedDate: string;
  formattedTime: string;
}

interface NextAppointmentProps {
  patientId: string;
}

const NextAppointment: React.FC<NextAppointmentProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar todas las citas del paciente
    try {
      const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const patientAppointments = allAppointments.filter(
        (app: any) => app.patientId === patientId && app.status === 'pending'
      );
      
      if (patientAppointments.length > 0) {
        // Ordenar por fecha
        const sortedAppointments = patientAppointments.sort(
          (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  }, [patientId]);

  if (appointments.length === 0) {
    return (
      <div className="bg-white border border-softGreen-200 rounded-lg p-4 shadow-sm mb-6 text-center">
        <p className="text-gray-600">No tienes citas programadas</p>
        <button
          onClick={() => navigate('/reserva-citas')}
          className="mt-2 bg-softGreen-600 text-white px-4 py-2 rounded-lg hover:bg-softGreen-700 transition"
        >
          Reservar Cita
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-softGreen-200 rounded-lg p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900 text-lg">Mis Citas Médicas</h3>
        <button
          onClick={() => navigate('/reserva-citas')}
          className="bg-softGreen-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-softGreen-700 transition"
        >
          Nueva Cita
        </button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="border-b border-gray-100 pb-3 last:border-0">
            <div className="flex items-start">
              <div className="bg-softGreen-100 p-2 rounded-full mr-4">
                <Calendar className="h-5 w-5 text-softGreen-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {appointment.formattedDate} a las {appointment.formattedTime}
                </p>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {appointment.doctorName} - {appointment.doctorSpecialty}
                </p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {appointment.status === 'pending' ? 'Pendiente' : 
                     appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {appointments.length >= 3 && (
        <div className="mt-3 text-center">
          <button 
            onClick={() => navigate('/patient-dashboard')}
            className="text-softGreen-600 text-sm hover:underline"
          >
            Ver todas mis citas
          </button>
        </div>
      )}
    </div>
  );
};

export default NextAppointment;