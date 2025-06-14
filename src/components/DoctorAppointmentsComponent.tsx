import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  formattedDate: string;
  formattedTime: string;
}

interface BlockedTime {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  formattedDate: string;
}

interface DoctorAppointmentsComponentProps {
  doctorId: string;
}

const DoctorAppointmentsComponent: React.FC<DoctorAppointmentsComponentProps> = ({ doctorId }) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([]);
  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockDate, setBlockDate] = useState<Date | undefined>(undefined);
  const [blockTime, setBlockTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Cargar citas y horarios bloqueados
  useEffect(() => {
    loadAppointments();
    loadBlockedTimes();
  }, [doctorId]);
  
  const loadAppointments = () => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const doctorAppointments = storedAppointments.filter(
        (app: any) => app.doctorId === doctorId
      );
      setAppointments(doctorAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };
  
  const loadBlockedTimes = () => {
    try {
      const storedBlockedTimes = JSON.parse(localStorage.getItem('blockedTimes') || '[]');
      const doctorBlockedTimes = storedBlockedTimes.filter(
        (block: BlockedTime) => block.doctorId === doctorId
      );
      setBlockedTimes(doctorBlockedTimes);
    } catch (error) {
      console.error('Error loading blocked times:', error);
    }
  };
  
  // Generar horarios disponibles para bloquear
  useEffect(() => {
    if (!blockDate) {
      setAvailableTimes([]);
      return;
    }

    const times: string[] = [];
    const isWeekendDay = [0, 6].includes(blockDate.getDay()); // 0 es domingo, 6 es sábado
    
    // Horarios para días laborables (L-V): 8:00 a 21:00
    // Horarios para fin de semana (S-D): 8:00 a 14:00
    const startHour = 8;
    const endHour = isWeekendDay ? 14 : 21;
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    setAvailableTimes(times);
  }, [blockDate]);
  
  const handleBlockTime = () => {
    if (!blockDate || !blockTime) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona fecha y hora',
        variant: 'destructive'
      });
      return;
    }
    
    // Crear objeto de fecha para el bloqueo
    const formattedDate = format(blockDate, 'yyyy-MM-dd');
    
    // Verificar si ya existe un bloqueo para esta fecha y hora
    const existingBlock = blockedTimes.find(
      block => block.date === formattedDate && block.time === blockTime
    );
    
    if (existingBlock) {
      toast({
        title: 'Error',
        description: 'Ya has bloqueado este horario',
        variant: 'destructive'
      });
      return;
    }
    
    // Verificar si ya existe una cita para esta fecha y hora
    const existingAppointment = appointments.find(app => {
      const appDate = new Date(app.date);
      return (
        format(appDate, 'yyyy-MM-dd') === formattedDate &&
        format(appDate, 'HH:mm') === blockTime
      );
    });
    
    if (existingAppointment) {
      toast({
        title: 'Error',
        description: 'Ya tienes una cita programada en este horario',
        variant: 'destructive'
      });
      return;
    }
    
    // Crear nuevo bloqueo
    const newBlock: BlockedTime = {
      id: Date.now().toString(),
      doctorId,
      date: formattedDate,
      time: blockTime,
      formattedDate: format(blockDate, 'PPP', { locale: es })
    };
    
    // Guardar en localStorage
    const allBlockedTimes = JSON.parse(localStorage.getItem('blockedTimes') || '[]');
    allBlockedTimes.push(newBlock);
    localStorage.setItem('blockedTimes', JSON.stringify(allBlockedTimes));
    
    // Actualizar estado
    setBlockedTimes([...blockedTimes, newBlock]);
    setBlockDate(undefined);
    setBlockTime('');
    setShowBlockForm(false);
    
    toast({
      title: 'Horario bloqueado',
      description: `Has bloqueado el ${format(blockDate, 'PPP', { locale: es })} a las ${blockTime}`,
    });
  };
  
  const handleUnblockTime = (blockId: string) => {
    // Eliminar bloqueo
    const allBlockedTimes = JSON.parse(localStorage.getItem('blockedTimes') || '[]');
    const updatedBlockedTimes = allBlockedTimes.filter(
      (block: BlockedTime) => block.id !== blockId
    );
    localStorage.setItem('blockedTimes', JSON.stringify(updatedBlockedTimes));
    
    // Actualizar estado
    setBlockedTimes(blockedTimes.filter(block => block.id !== blockId));
    
    toast({
      title: 'Horario desbloqueado',
      description: 'El horario ha sido desbloqueado correctamente',
    });
  };
  
  const handleUpdateAppointmentStatus = (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    // Actualizar estado de la cita
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = allAppointments.map((app: Appointment) => {
      if (app.id === appointmentId) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    // Actualizar estado
    setAppointments(appointments.map(app => {
      if (app.id === appointmentId) {
        return { ...app, status: newStatus };
      }
      return app;
    }));
    
    toast({
      title: newStatus === 'confirmed' ? 'Cita confirmada' : 'Cita cancelada',
      description: newStatus === 'confirmed' 
        ? 'La cita ha sido confirmada correctamente' 
        : 'La cita ha sido cancelada correctamente',
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Citas</h2>
        <Button 
          onClick={() => setShowBlockForm(!showBlockForm)}
          variant="outline"
          className="flex items-center gap-2"
        >
          {showBlockForm ? (
            <>
              <X className="h-4 w-4" />
              Cancelar
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              Bloquear Horario
            </>
          )}
        </Button>
      </div>
      
      {showBlockForm && (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Bloquear Horario</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona una fecha
              </label>
              <input 
                type="date" 
                className="w-full rounded-md border border-gray-300 p-2"
                onChange={(e) => setBlockDate(e.target.value ? new Date(e.target.value) : undefined)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {blockDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selecciona una hora
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableTimes.map((timeOption) => (
                    <Button
                      key={timeOption}
                      type="button"
                      variant={blockTime === timeOption ? 'default' : 'outline'}
                      className={`text-sm py-1 px-2 h-auto ${blockTime === timeOption ? 'bg-blue-500' : ''}`}
                      onClick={() => setBlockTime(timeOption)}
                    >
                      {timeOption}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleBlockTime}
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={!blockDate || !blockTime}
            >
              Bloquear Horario
            </Button>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-medium mb-4">Mis Citas</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tienes citas programadas</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border p-4 rounded-lg shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Paciente: {appointment.patientId}</p>
                    <p>Fecha: {appointment.formattedDate} a las {appointment.formattedTime}</p>
                    <p>Estado: 
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'pending' ? 'Pendiente' :
                         appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </p>
                  </div>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        size="sm"
                      >
                        Confirmar
                      </Button>
                      <Button 
                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-xl font-medium mb-4">Horarios Bloqueados</h3>
        {blockedTimes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tienes horarios bloqueados</p>
        ) : (
          <div className="space-y-2">
            {blockedTimes.map((block) => (
              <div key={block.id} className="flex justify-between items-center border p-3 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{block.formattedDate} a las {block.time}</span>
                </div>
                <Button 
                  onClick={() => handleUnblockTime(block.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsComponent;