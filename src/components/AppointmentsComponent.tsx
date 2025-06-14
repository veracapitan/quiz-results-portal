import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


import AppointmentForm from './AppointmentForm';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentFormData {
  doctorId: string;
  date: Date;
}

interface AppointmentsComponentProps {
  patientId: string;
}

const AppointmentsComponent: React.FC<AppointmentsComponentProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = JSON.parse(localStorage.getItem('doctors') || '[]');
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const appointmentsData = JSON.parse(localStorage.getItem('appointments') || '[]');
        const patientAppointments = appointmentsData.filter(
          (app: any) => app.patientId === patientId
        );
        setAppointments(patientAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchDoctors();
    fetchAppointments();
  }, [patientId]);

  const createAppointment = async (appointmentData: AppointmentFormData) => {
    try {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId,
        doctorId: appointmentData.doctorId,
        date: appointmentData.date,
        status: 'pending',
      };
      
      const appointmentsData = JSON.parse(localStorage.getItem('appointments') || '[]');
      appointmentsData.push(newAppointment);
      localStorage.setItem('appointments', JSON.stringify(appointmentsData));
      
      setAppointments([...appointments, newAppointment]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Citas</h2>
        <button
          onClick={() => navigate(`/reserva-citas?patientId=${patientId}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Nueva Cita
        </button>
      </div>

      {showForm && (
        <AppointmentForm 
          onSubmit={createAppointment}
          onCancel={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)} 
          patientId={patientId} 
          doctors={doctors} 
        />
      )}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tienes citas programadas</p>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="border p-4 rounded shadow-sm">
              <p className="font-medium">Fecha: {new Date(appointment.date).toLocaleString()}</p>
              <p>Estado: {appointment.status === 'pending' ? 'Pendiente' : 
                        appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentsComponent;