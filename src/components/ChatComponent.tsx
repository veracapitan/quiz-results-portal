import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  isDoctor: boolean;
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  conversationId: string;
  attachment?: {
    type: 'image';
    url: string;
    name: string;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

interface ChatComponentProps {
  patientId?: string;
  doctorId?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ patientId, doctorId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Doctor[]>([]);

  useEffect(() => {
    const getRegisteredDoctors = () => {
      if (doctorId) {
        // Si es médico, cargar solo sus pacientes con mensajes
        const patientKeys = Object.keys(localStorage).filter(key => 
          key.startsWith(`chat_`) && key.includes(`_${doctorId}`)
        );
        
        const patientsList: Doctor[] = [];
        patientKeys.forEach(key => {
          const patientUid = key.split('_')[1];
          const name = localStorage.getItem(`user_name_${patientUid}`) || '';
          const surname = localStorage.getItem(`user_surname_${patientUid}`) || '';
          
          patientsList.push({
            id: patientUid,
            name: `${name} ${surname}`.trim(),
            specialty: 'Paciente',
            avatar: '/patient-avatar.png'
          });
        });
        
        setPatients(patientsList);
        return;
      }
      const doctorsList: Doctor[] = [];
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
              id: uid,
              name: `Dr. ${name} ${surname}`.trim(),
              specialty,
              avatar: '/doctor-avatar.png'
            });
          }
        }
      });
      
      setDoctors(doctorsList);
    };
    
    getRegisteredDoctors();
  }, []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes de localStorage cuando cambia el médico seleccionado
  useEffect(() => {
    if (!selectedDoctor) {
      setMessages([]);
      return;
    }
    const chatKey = user?.role === 'doctor' ? `chat_${selectedPatient?.id}_${user.uid}` : `chat_${patientId}_${selectedDoctor?.id}`;
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      try {
        const parsed: (Omit<Message, 'timestamp'> & { timestamp: string })[] = JSON.parse(saved);
        const withDates: Message[] = parsed.map(msg => ({
          isDoctor: msg.isDoctor || false,
          id: msg.id || Date.now().toString(),
          content: msg.content || '',
          senderId: msg.senderId || 'unknown',
          conversationId: msg.conversationId || '',
          receiverId: msg.receiverId || (user?.role === 'doctor' ? selectedPatient?.id : selectedDoctor?.id),
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(withDates);
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [patientId, selectedDoctor]);

  // Guardar mensajes en localStorage cuando cambian
  useEffect(() => {
    if (!selectedDoctor) return;
    const chatKey = user?.role === 'doctor' ? `chat_${selectedPatient?.id}_${user.uid}` : `chat_${patientId}_${selectedDoctor?.id}`;
    localStorage.setItem(
        chatKey,
      JSON.stringify(
        messages.map(msg => ({
          ...msg,
          // Convertimos Date a ISO para el almacenamiento
          timestamp: msg.timestamp.toISOString(),
        }))
      )
    );
  }, [messages, patientId, selectedDoctor]);

  const [attachments, setAttachments] = useState<File[]>([]);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setAttachments(Array.from(e.target.files));
  }
};

const sendMessage = () => {
  if (!newMessage.trim() && attachments.length === 0 || !selectedDoctor) return;

  const msg: Message = {
    id: Date.now().toString(),
    content: newMessage.trim(),
    senderId: user?.uid || 'unknown',
    timestamp: new Date(),
    isDoctor: user?.role === 'doctor',
    receiverId: user?.role === 'doctor' ? selectedPatient?.id : selectedDoctor?.id,
    conversationId: user?.role === 'doctor' ? `chat_${selectedPatient?.id}_${user.uid}` : `chat_${patientId}_${selectedDoctor?.id}`,
    ...(attachments.length > 0 && {
      attachment: {
        type: 'image',
        url: URL.createObjectURL(attachments[0]),
        name: attachments[0].name
      }
    })
  };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 border rounded-lg bg-green-100">
      <button 
        onClick={() => navigate(-1)}
        className="self-start mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver
      </button>
      {!selectedDoctor && !selectedPatient ? (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">
          {doctorId ? 'Tus pacientes' : 'Selecciona un médico'}
        </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(doctorId ? patients : doctors).map(person => (
              <div
                key={person.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => doctorId ? setSelectedPatient(person) : setSelectedDoctor(person)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={person.avatar} />
                    <AvatarFallback>
                      {person.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center p-3 border-b">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={selectedDoctor ? selectedDoctor.avatar : selectedPatient?.avatar} />
              <AvatarFallback>
                {(selectedDoctor ? selectedDoctor.name : selectedPatient?.name)
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedDoctor ? selectedDoctor.name : selectedPatient?.name}</h3>
              <p className="text-xs text-gray-500">{selectedDoctor ? selectedDoctor.specialty : selectedPatient?.specialty}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 mb-4 rounded-md border p-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start mb-4 ${
                  message.isDoctor ? 'justify-end' : 'justify-start'
                }`}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={message.isDoctor ? '/doctor-avatar.png' : '/patient-avatar.png'}
                  />
                  <AvatarFallback>{message.isDoctor ? 'DR' : 'PT'}</AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isDoctor
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.attachment && (
                    <div className="mt-2">
                      <img 
                        src={message.attachment.url} 
                        alt={message.attachment.name}
                        className="max-w-xs max-h-40 rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1"
                placeholder="Escribe un mensaje..."
              />
              <label className="cursor-pointer p-2 rounded hover:bg-gray-100">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple={false}
                />
                📎
              </label>
              <Button onClick={sendMessage}>Enviar</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatComponent;