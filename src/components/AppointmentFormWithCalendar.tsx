import React, { useState, useEffect } from 'react';
import { format, isWeekend, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface AppointmentFormWithCalendarProps {
  patientId: string;
}

const AppointmentFormWithCalendar: React.FC<AppointmentFormWithCalendarProps> = ({ patientId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Cargar doctores desde localStorage
  useEffect(() => {
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    if (storedDoctors.length === 0) {
      // Si no hay doctores, agregar algunos de ejemplo
      const exampleDoctors = [
        { id: '1', name: 'Dr. García', specialty: 'Dermatología' },
        { id: '2', name: 'Dra. Martínez', specialty: 'Alergología' },
        { id: '3', name: 'Dr. Rodríguez', specialty: 'Dermatología Pediátrica' }
      ];
      localStorage.setItem('doctors', JSON.stringify(exampleDoctors));
      setDoctors(exampleDoctors);
    } else {
      setDoctors(storedDoctors);
    }
  }, []);

  // Generar horarios disponibles según el día seleccionado
  useEffect(() => {
    if (!date || !selectedDoctor) {
      setAvailableTimes([]);
      return;
    }
  
    const times: string[] = [];
    const isWeekendDay = isWeekend(date);
    
    // Horarios para días laborables (L-V): 8:00 a 21:00
    // Horarios para fin de semana (S-D): 8:00 a 14:00
    const startHour = 8;
    const endHour = isWeekendDay ? 14 : 21;
    
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    // Filtrar horarios bloqueados por el médico
    const formattedDate = format(date, 'yyyy-MM-dd');
    const blockedTimes = JSON.parse(localStorage.getItem('blockedTimes') || '[]');
    const doctorBlockedTimes = blockedTimes.filter(
      (block: any) => block.doctorId === selectedDoctor && block.date === formattedDate
    ).map((block: any) => block.time);
    
    // Filtrar horarios ya reservados
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const doctorAppointments = appointments.filter(
      (app: any) => app.doctorId === selectedDoctor && format(new Date(app.date), 'yyyy-MM-dd') === formattedDate
    ).map((app: any) => format(new Date(app.date), 'HH:mm'));
    
    // Eliminar horarios bloqueados y ya reservados
    const availableTimes = times.filter(
      time => !doctorBlockedTimes.includes(time) && !doctorAppointments.includes(time)
    );
    
    setAvailableTimes(availableTimes);
  }, [date, selectedDoctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !selectedDoctor) {
      toast({
        title: 'Error',
        description: 'Por favor, completa todos los campos',
        variant: 'destructive'
      });
      return;
    }
    
    // Crear objeto de fecha combinando fecha y hora
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    // Encontrar el doctor seleccionado para mostrar su nombre
    const selectedDoctorData = doctors.find(doc => doc.id === selectedDoctor);
    
    // Crear la cita
    const newAppointment = {
      id: Date.now().toString(),
      patientId,
      doctorId: selectedDoctor,
      doctorName: selectedDoctorData?.name || 'Doctor',
      doctorSpecialty: selectedDoctorData?.specialty || 'Especialidad',
      date: appointmentDate,
      status: 'pending',
      formattedDate: format(appointmentDate, 'PPP', { locale: es }),
      formattedTime: time
    };
    
    // Guardar en localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Ya no necesitamos guardar solo la última cita
    // localStorage.setItem('lastAppointment', JSON.stringify(newAppointment));
    
    toast({
      title: 'Cita reservada',
      description: `Tu cita ha sido reservada para el ${format(appointmentDate, 'PPP', { locale: es })} a las ${time}`,
    });
    
    // Redireccionar a la página principal
    navigate('/resultados');
  };

  // Función para deshabilitar días pasados y personalizar días disponibles si es necesario
  const disabledDays = {
    before: startOfDay(new Date()),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona un médico
          </label>
          <Select
            value={selectedDoctor}
            onValueChange={setSelectedDoctor}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un médico" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona una fecha
          </label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledDays}
            className="rounded-md border shadow p-3"
          />
        </div>
        
        {date && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecciona una hora
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((timeOption) => (
                <Button
                  key={timeOption}
                  type="button"
                  variant={time === timeOption ? 'default' : 'outline'}
                  className={`text-sm py-1 px-2 h-auto ${time === timeOption ? 'bg-blue-500' : ''}`}
                  onClick={() => setTime(timeOption)}
                >
                  {timeOption}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!date || !time || !selectedDoctor}
        >
          Reservar Cita
        </Button>
      </div>
    </form>
  );
};

export default AppointmentFormWithCalendar;