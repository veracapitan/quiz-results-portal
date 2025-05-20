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
  chatKey?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ patientId, doctorId, chatKey }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const loadDoctors = () => {
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

    loadDoctors();
  }, []);

  useEffect(() => {
    if (chatKey) {
      try {
        const saved = localStorage.getItem(chatKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          const withDates: Message[] = parsed.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(withDates);
        } else {
          setMessages([]);
          localStorage.setItem(chatKey, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        setMessages([]);
      }
    }
  }, [chatKey]);

  useEffect(() => {
    if (chatKey && messages.length > 0) {
      try {
        localStorage.setItem(
          chatKey,
          JSON.stringify(
            messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString()
            }))
          )
        );
      } catch (error) {
        console.error('Error al guardar mensajes:', error);
      }
    }
  }, [messages, chatKey]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const sendMessage = () => {
    if ((!newMessage.trim() && attachments.length === 0) || (!selectedDoctor && !chatKey)) return;

    // Usar el chatKey existente si está disponible, si no, crear uno nuevo
    const currentChatKey = chatKey || `chat_${user?.uid}_${selectedDoctor?.id}`;
    
    const msg: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: user?.uid || 'unknown',
      timestamp: new Date(),
      isDoctor: user?.role === 'doctor', // Establecer basado en el rol del usuario
      receiverId: doctorId || selectedDoctor?.id || '',
      conversationId: currentChatKey,
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
    setAttachments([]);

    // Guardar en localStorage
    const currentMessages = JSON.parse(localStorage.getItem(currentChatKey) || '[]');
    localStorage.setItem(
      currentChatKey,
      JSON.stringify([
        ...currentMessages,
        {
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }
      ])
    );
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 border rounded-lg bg-green-50">
      {!selectedDoctor && !chatKey ? (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Selecciona un médico para chatear</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctors.map(doctor => (
              <div
                key={doctor.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors duration-200"
                onClick={() => setSelectedDoctor(doctor)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback>
                      {doctor.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {doctors.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay médicos disponibles en este momento</p>
          )}
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
              <AvatarImage src={selectedDoctor?.avatar} />
              <AvatarFallback>
                {selectedDoctor?.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedDoctor?.name}</h3>
              <p className="text-xs text-gray-500">{selectedDoctor?.specialty}</p>
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