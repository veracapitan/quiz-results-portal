import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
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

interface ChatComponentProps {
  patientId: string;
  doctorId: string;
  chatKey: string;
  onBack: () => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ patientId, doctorId, chatKey, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Determinar el otro participante
  const otherId = user?.role === 'doctor' ? patientId : doctorId;

  // Obtener nombre y apellido del otro usuario desde localStorage
  const otherName = localStorage.getItem(`user_name_${otherId}`) || 'Desconocido';
  const otherSurname = localStorage.getItem(`user_surname_${otherId}`) || '';

  const otherAvatar = user?.role === 'doctor' ? '/patient-avatar.png' : '/doctor-avatar.png';

  // Cargar mensajes al montar
  useEffect(() => {
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      const parsed: Message[] = JSON.parse(saved).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsed);
    }
  }, [chatKey]);

  // Sincronizar con cambios en otras pestañas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === chatKey) {
        const updated = JSON.parse(e.newValue || '[]').map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(updated);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [chatKey]);

  // Auto scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const msg: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      senderId: user!.uid,
      receiverId: otherId,
      timestamp: new Date(),
      conversationId: chatKey,
      isDoctor: user!.role === 'doctor',
      senderName: user!.name,
      senderSurname: user!.surname,
      attachment: attachments.length > 0 ? {
        type: 'image',
        url: URL.createObjectURL(attachments[0]),
        name: attachments[0].name
      } : undefined
    };

    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages.map(m => ({
      ...m,
      timestamp: m.timestamp.toISOString()
    }))));

    setNewMessage('');
    setAttachments([]);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-green-50">
      {/* ENCABEZADO CON NOMBRE DEL OTRO USUARIO */}
      <div className="flex items-center p-3 border-b">
        <button onClick={onBack} className="mr-2 text-gray-500 hover:text-gray-700">←</button>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={otherAvatar} />
          <AvatarFallback>{`${otherName[0] || ''}${otherSurname[0] || ''}`}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-base">{`${otherName} ${otherSurname}`}</h3>
        </div>
      </div>

      {/* MENSAJES */}
      <ScrollArea className="flex-1 px-4 py-2 overflow-y-auto">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex items-start mb-4 ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs p-3 rounded-lg ${message.senderId === user?.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p>{message.content}</p>
              {message.attachment && (
                <img src={message.attachment.url} alt={message.attachment.name} className="mt-2 max-w-full rounded-md" />
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* INPUT DE MENSAJE */}
      <div className="p-3 border-t flex space-x-2">
        <Input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <label className="cursor-pointer px-2">
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          📎
        </label>
        <Button onClick={sendMessage}>Enviar</Button>
      </div>
    </div>
  );
};

export default ChatComponent;