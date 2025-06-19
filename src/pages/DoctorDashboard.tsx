import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DoctorAppointmentsComponent from '@/components/DoctorAppointmentsComponent';
import DoctorsList from '@/components/DoctorsList';
import Layout from '@/components/Layout';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  const predefinedUsers = [
    { id: 'user1', name: 'John Doe', value: 'Value 1' },
    { id: 'user2', name: 'Jane Smith', value: 'Value 2' },
    { id: 'user3', name: 'Alice Johnson', value: 'Value 3' },
    { id: 'user4', name: 'Carlos Martinez', value: 'Value 4' },
    { id: 'user5', name: 'Maria Lopez', value: 'Value 5' },
    { id: 'user6', name: 'Luis Fernandez', value: 'Value 6' }
  ];

  // Render predefined users
  <div className="predefined-users">
    <h2>Predefined Users</h2>
    <ul>
      {predefinedUsers.map(user => (
        <li key={user.id}>
          <span>{user.name}</span>: <span>{user.value}</span>
        </li>
      ))}
    </ul>
  </div>

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex space-x-4 border-b pb-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'appointments' ? 'bg-softGreen-100 text-softGreen-700 border-b-2 border-softGreen-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Gestión de Citas
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 font-medium rounded-t-lg ${activeTab === 'patients' ? 'bg-softGreen-100 text-softGreen-700 border-b-2 border-softGreen-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Médicos
          </button>
        </div>

        {activeTab === 'appointments' && user && (
          <DoctorAppointmentsComponent doctorId={user.uid} />
        )}

        {activeTab === 'patients' && (
          <DoctorsList />
        )}
      </div>
    </Layout>
  );
};

export default DoctorDashboard;