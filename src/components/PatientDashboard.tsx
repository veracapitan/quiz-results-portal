import React, { useState } from 'react';
import ChatComponent from './ChatComponent';
import AppointmentsComponent from './AppointmentsComponent';
import ResultsComponent from './ResultsComponent';
// Se eliminaron las importaciones de ChatComponent y AppointmentsComponent debido a errores de módulo no encontrado

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
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

interface PatientDashboardProps {
  patientId: string;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded ${activeTab === 'results' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Mis Resultados
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded ${activeTab === 'appointments' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Citas
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Bienvenido</h2>
          {/* Contenido del dashboard */}
        </div>
      )}

      {activeTab === 'results' && (
        <ResultsComponent patientId={patientId} />
      )}

      {activeTab === 'chat' && (
        <ChatComponent patientId={patientId} />
      )}

      {activeTab === 'appointments' && (
        <AppointmentsComponent patientId={patientId} />
      )}
    </div>
  );
};

export default PatientDashboard; 