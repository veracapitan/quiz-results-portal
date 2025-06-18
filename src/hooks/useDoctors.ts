import { useState, useEffect } from 'react';

interface Doctor {
  uid: string;
  name: string;
  surname: string;
  specialty?: string;
}

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              uid,
              name,
              surname,
              specialty
            });
          }
        }
      });
      
      // Si no hay médicos, agregar algunos de ejemplo
      if (doctorsList.length === 0) {
        const exampleDoctors = [
          {
            uid: 'doctor-1',
            name: 'Juan',
            surname: 'Pérez',
            specialty: 'Dermatología'
          },
          {
            uid: 'doctor-2',
            name: 'María',
            surname: 'García',
            specialty: 'Alergología'
          },
          {
            uid: 'doctor-3',
            name: 'Carlos',
            surname: 'López',
            specialty: 'Dermatología Pediátrica'
          },
          {
            uid: 'doctor-4',
            name: 'Ana',
            surname: 'Martínez',
            specialty: 'Medicina General'
          }
        ];
        
        // Guardar los médicos de ejemplo en localStorage
        exampleDoctors.forEach(doctor => {
          localStorage.setItem(`user_role_${doctor.uid}`, 'doctor');
          localStorage.setItem(`user_name_${doctor.uid}`, doctor.name);
          localStorage.setItem(`user_surname_${doctor.uid}`, doctor.surname);
          localStorage.setItem(`user_specialty_${doctor.uid}`, doctor.specialty);
        });
        
        setDoctors(exampleDoctors);
      } else {
        setDoctors(doctorsList);
      }
      
      setIsLoading(false);
    };

    loadDoctors();
  }, []);

  return { doctors, isLoading };
}; 