import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ChatComponent from '@/components/ChatComponent';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { useDoctors } from '@/hooks/useDoctors';
import { usePatients } from '@/hooks/usePatients';

interface SavedChat {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: Date;
}

function getChatKey(userId1: string, userId2: string) {
  return `chat_${[userId1, userId2].sort().join('_')}`;
}

const Mensajes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId, doctorId, chatKey, newChat } = location.state || {};
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<{
    chatKey: string;
    patientId: string;
    doctorId: string;
  } | null>(null);
  const [showParticipantList, setShowParticipantList] = useState(false);
  const { doctors } = useDoctors();
  const { patients } = usePatients();

  useEffect(() => {
    if (chatKey && doctorId && patientId) {
      setSelectedChat({ chatKey, patientId, doctorId });
    }
  }, [chatKey, doctorId, patientId]);

  useEffect(() => {
    if (!user) return;

    const chatKeys = Object.keys(localStorage).filter(key =>
      key.startsWith('chat_') && key.includes(user.uid)
    );

    const chats: SavedChat[] = chatKeys.map(key => {
      const messages = JSON.parse(localStorage.getItem(key) || '[]');
      const lastMessage = messages[messages.length - 1] || {};
      const ids = key.replace('chat_', '').split('_');
      const participantId = ids.find(id => id !== user.uid) || '';
      const name = localStorage.getItem(`user_name_${participantId}`) || 'Usuario';
      const surname = localStorage.getItem(`user_surname_${participantId}`) || '';

      return {
        id: key,
        participantName: `${name} ${surname}`.trim(),
        lastMessage: lastMessage.content || 'Sin mensajes',
        timestamp: new Date(lastMessage.timestamp || Date.now())
      };
    });

    setSavedChats(chats.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, [user]);

  if (!user?.uid) return <Navigate to="/login" />;

  return (
    <Layout>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-500">←</button>
          <h1 className="text-2xl font-bold">Mensajes</h1>
          {!selectedChat && !showParticipantList && (
            <button onClick={() => setShowParticipantList(true)} className="ml-auto bg-green-500 text-white px-4 py-2 rounded">
              Nuevo Chat
            </button>
          )}
        </div>

        {showParticipantList ? (
          <div>
            <h2 className="text-xl mb-4">
              {user.role === 'doctor' ? 'Selecciona un paciente' : 'Selecciona un médico'}
            </h2>
            <div className="grid gap-4">
              {(user.role === 'doctor' ? patients : doctors).map(person => {
                const otherId = person.uid;
                const newChatKey = getChatKey(user.uid, otherId);
                const isDoctor = user.role === 'doctor';

                return (
                  <div key={otherId} className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedChat({
                        chatKey: newChatKey,
                        patientId: isDoctor ? otherId : user.uid,
                        doctorId: isDoctor ? user.uid : otherId,
                      });
                      setShowParticipantList(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{person.name[0]}{person.surname[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{`${person.name} ${person.surname}`}</h3>
                        <p className="text-sm text-gray-500">
                          {isDoctor ? 'Paciente' : (person.specialty || 'Médico')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedChat ? (
          <ChatComponent
            chatKey={selectedChat.chatKey}
            patientId={selectedChat.patientId}
            doctorId={selectedChat.doctorId}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="grid gap-4">
            {savedChats.length > 0 ? (
              savedChats.map(chat => {
                const [_, id1, id2] = chat.id.split('_');
                const role1 = localStorage.getItem(`user_role_${id1}`);
                const patientId = role1 === 'patient' ? id1 : id2;
                const doctorId = role1 === 'doctor' ? id1 : id2;

                return (
                  <div key={chat.id} className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      setSelectedChat({
                        chatKey: chat.id,
                        patientId,
                        doctorId
                      })
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{chat.participantName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{chat.participantName}</h3>
                        <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-400">{chat.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No hay conversaciones</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Mensajes;