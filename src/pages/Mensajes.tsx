import React from 'react';
import Layout from '@/components/Layout';
import ChatComponent from '@/components/ChatComponent';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Mensajes = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mensajes</h1>
        <div className="border rounded-lg h-[600px]">
          <ChatComponent 
            patientId={user.role === 'patient' ? user.uid : ''} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Mensajes;