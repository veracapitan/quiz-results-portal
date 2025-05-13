import React, { useState } from 'react';

interface AppointmentFormProps {
  patientId: string;
  doctors: { id: string; name: string; specialty: string; }[];
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  onSuccess: () => void;
}

export interface AppointmentFormData {
  doctorId: string;
  date: Date;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ patientId, doctors, onSubmit, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    doctorId: '',
    date: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Doctor
        </label>
        <select
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Selecciona un doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha y Hora
        </label>
        <input
          type="datetime-local"
          value={formData.date.toISOString().slice(0, 16)}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Crear Cita
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;