<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ChatComponent from '@/components/ChatComponent';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';

interface SavedChat {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: Date;
}

const Mensajes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId, doctorId, chatKey, newChat } = location.state || {};
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    chatKey: string;
    patientId: string;
    doctorId: string;
  } | null>(null);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctors, setDoctors] = useState<Array<{
    uid: string;
    name: string;
    surname: string;
    specialty?: string;
  }>>([]);

  useEffect(() => {
    // Si tenemos chatKey, doctorId y patientId, establecer el chat seleccionado
    if (chatKey && doctorId && patientId) {
      setSelectedChat({
        chatKey,
        patientId,
        doctorId
      });
    }
  }, [chatKey, doctorId, patientId]);

  useEffect(() => {
    const loadChats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const chatKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('chat_') && (
            (user.role === 'doctor' && key.includes(`_${user.uid}`)) ||
            (user.role === 'patient' && key.includes(`_${user.uid}`))
          )
        );

        const chats: SavedChat[] = chatKeys.map(key => {
          const messages = JSON.parse(localStorage.getItem(key) || '[]');
          const lastMessage = messages[messages.length - 1] || {};
          const participantId = key.split('_')[1] === user.uid ? key.split('_')[2] : key.split('_')[1];
          const participantName = localStorage.getItem(`user_name_${participantId}`) || 'Usuario';
          const participantSurname = localStorage.getItem(`user_surname_${participantId}`) || '';

          return {
            id: key,
            participantName: `${participantName} ${participantSurname}`.trim(),
            lastMessage: lastMessage.content || 'No hay mensajes',
            timestamp: new Date(lastMessage.timestamp || Date.now())
          };
        });

        setSavedChats(chats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (error) {
        console.error('Error al cargar los chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Mover el useEffect de loadDoctors aquí, antes del return
  useEffect(() => {
    if (showDoctorList) {
      const loadDoctors = () => {
        const doctorsList = [];
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
          if (key.startsWith('user_role_')) {
            const uid = key.replace('user_role_', '');
            const role = localStorage.getItem(key);
            if (role === 'doctor') {
              const name = localStorage.getItem(`user_name_${uid}`) || '';
              const surname = localStorage.getItem(`user_surname_${uid}`) || '';
              const specialty = localStorage.getItem(`user_specialty_${uid}`) || 'Medicina General';
              
              doctorsList.push({
                uid,
                name,
                surname,
                specialty
              });
            }
          }
        });
        
        setDoctors(doctorsList);
      };

      loadDoctors();
    }
  }, [showDoctorList]);

  if (!user?.uid) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mensajes</h1>
          {user?.role === 'patient' && !selectedChat && !showDoctorList && (
            <button
              onClick={() => setShowDoctorList(true)}
              className="bg-softGreen-500 hover:bg-softGreen-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Nuevo Chat con Médico
            </button>
          )}
        </div>

        {showDoctorList ? (
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Selecciona un médico para chatear</h2>
              <button
                onClick={() => setShowDoctorList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Volver
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.uid}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 shadow-sm"
                  onClick={() => {
                    const newChatKey = `chat_${user.uid}_${doctor.uid}`;
                    setSelectedChat({
                      chatKey: newChatKey,
                      patientId: user.uid,
                      doctorId: doctor.uid
                    });
                    setShowDoctorList(false);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {`${doctor.name[0]}${doctor.surname[0]}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{`${doctor.name} ${doctor.surname}`}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty || 'Médico General'}</p>
                    </div>
                  </div>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="text-center py-8 col-span-2">
                  <p className="text-gray-500">
                    No hay médicos disponibles en este momento
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : selectedChat ? (
          <div className="border rounded-lg h-[600px] shadow-lg">
            <ChatComponent 
              patientId={selectedChat.patientId}
              doctorId={selectedChat.doctorId}
              chatKey={selectedChat.chatKey}
            />
          </div>
        ) : (
          <div className="grid gap-4">
            {savedChats.length > 0 ? (
              savedChats.map(chat => (
                <div 
                  key={chat.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 shadow-sm"
                  onClick={() => {
                    const [_, pid, did] = chat.id.split('_');
                    setSelectedChat({
                      chatKey: chat.id,
                      patientId: pid,
                      doctorId: did
                    });
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {chat.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{chat.participantName}</h3>
                      <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-400">
                        {chat.timestamp.toLocaleDateString()} {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay conversaciones guardadas</p>
                {user?.role === 'patient' && (
                  <button
                    onClick={() => navigate('/mensajes', { state: { newChat: true } })}
                    className="bg-softGreen-500 hover:bg-softGreen-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Iniciar Nueva Conversación
                  </button>
                )}
              </div>
            )}
          </div>
        )}
=======
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
>>>>>>> 3b008e380491e6ba2d199016330fcd7fa128de4c
      </div>
    </Layout>
  );
};

export default Mensajes;