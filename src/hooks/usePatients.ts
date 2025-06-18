import { useState, useEffect } from 'react';

interface Patient {
  uid: string;
  name: string;
  surname: string;
  email?: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPatients = () => {
      const patientsList: Patient[] = [];
      
      console.log('=== usePatients Debug ===');
      
      // Intentar leer desde el sistema de autenticación
      const storedUsers = localStorage.getItem('vitalytics-users');
      if (storedUsers) {
        try {
          const users = JSON.parse(storedUsers);
          console.log('Usuarios encontrados en vitalytics-users:', users);
          
          users.forEach((user: any) => {
            if (user.role === 'patient') {
              console.log(`Paciente encontrado: ${user.name} ${user.surname} (${user.uid})`);
              patientsList.push({
                uid: user.uid,
                name: user.name,
                surname: user.surname,
                email: user.email
              });
            }
          });
        } catch (error) {
          console.error('Error parsing vitalytics-users:', error);
        }
      }
      
      // También buscar en el sistema antiguo (keys individuales) por compatibilidad
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('user_role_')) {
          const uid = key.replace('user_role_', '');
          const role = localStorage.getItem(key);
          console.log(`Key: ${key}, UID: ${uid}, Role: ${role}`);
          
          if (role === 'patient') {
            const name = localStorage.getItem(`user_name_${uid}`) || '';
            const surname = localStorage.getItem(`user_surname_${uid}`) || '';
            const email = localStorage.getItem(`user_email_${uid}`) || '';
            
            console.log(`Paciente encontrado (sistema antiguo): ${name} ${surname} (${uid})`);
            
            // Solo agregar si tiene nombre y apellido y no está ya en la lista
            if (name && surname && !patientsList.some(p => p.uid === uid)) {
              patientsList.push({
                uid,
                name,
                surname,
                email
              });
            } else if (!name || !surname) {
              console.log(`Paciente ${uid} descartado: nombre="${name}", apellido="${surname}"`);
            }
          }
        }
      });
      
      console.log('Pacientes válidos encontrados:', patientsList);
      
      // Solo crear pacientes de ejemplo si realmente no hay ninguno
      if (patientsList.length === 0) {
        console.log('No se encontraron pacientes, creando ejemplos...');
        const examplePatients = [
          {
            uid: 'patient-1',
            name: 'Ana',
            surname: 'García',
            email: 'ana.garcia@email.com'
          },
          {
            uid: 'patient-2',
            name: 'Luis',
            surname: 'Martínez',
            email: 'luis.martinez@email.com'
          },
          {
            uid: 'patient-3',
            name: 'Carmen',
            surname: 'Rodríguez',
            email: 'carmen.rodriguez@email.com'
          },
          {
            uid: 'patient-4',
            name: 'Pedro',
            surname: 'López',
            email: 'pedro.lopez@email.com'
          }
        ];
        
        // Guardar los pacientes de ejemplo en el sistema de autenticación
        const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
        examplePatients.forEach(patient => {
          const newUser = {
            uid: patient.uid,
            email: patient.email,
            name: patient.name,
            surname: patient.surname,
            role: 'patient',
            password: 'password123' // Contraseña por defecto
          };
          existingUsers.push(newUser);
        });
        localStorage.setItem('vitalytics-users', JSON.stringify(existingUsers));
        
        setPatients(examplePatients);
      } else {
        console.log('Usando pacientes existentes:', patientsList);
        setPatients(patientsList);
      }
      
      setIsLoading(false);
    };

    loadPatients();
  }, []);

  return { patients, isLoading };
}; 