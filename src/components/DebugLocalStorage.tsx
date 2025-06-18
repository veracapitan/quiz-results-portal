import React, { useEffect, useState } from 'react';

const DebugLocalStorage = () => {
  const [localStorageData, setLocalStorageData] = useState<string>('');
  const [allKeys, setAllKeys] = useState<string>('');
  const [vitalyticsUsers, setVitalyticsUsers] = useState<string>('');

  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.includes('user_'));
    
    const data = userKeys.map(key => {
      const value = localStorage.getItem(key);
      return `${key}: ${value}`;
    }).join('\n');
    
    setLocalStorageData(data);
    setAllKeys(keys.join('\n'));
    
    // Mostrar contenido de vitalytics-users
    const storedUsers = localStorage.getItem('vitalytics-users');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        setVitalyticsUsers(JSON.stringify(users, null, 2));
      } catch (error) {
        setVitalyticsUsers('Error parsing vitalytics-users: ' + error);
      }
    } else {
      setVitalyticsUsers('No hay datos en vitalytics-users');
    }
  };

  const clearExamplePatients = () => {
    const keys = Object.keys(localStorage);
    let removed = 0;
    
    keys.forEach(key => {
      if (key.includes('patient-')) {
        localStorage.removeItem(key);
        removed++;
      }
    });
    
    alert(`Se eliminaron ${removed} entradas de pacientes de ejemplo`);
    updateData();
  };

  const clearAllPatients = () => {
    const keys = Object.keys(localStorage);
    let removed = 0;
    
    keys.forEach(key => {
      if (key.startsWith('user_role_')) {
        const uid = key.replace('user_role_', '');
        const role = localStorage.getItem(key);
        
        if (role === 'patient') {
          localStorage.removeItem(key);
          localStorage.removeItem(`user_name_${uid}`);
          localStorage.removeItem(`user_surname_${uid}`);
          localStorage.removeItem(`user_email_${uid}`);
          removed++;
        }
      }
    });
    
    alert(`Se eliminaron ${removed} pacientes`);
    updateData();
  };

  const runDebugCommand = () => {
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.includes('user_'));
    
    console.log('=== DEBUG COMMAND ===');
    console.log('Todas las keys en localStorage:', keys);
    console.log('Keys que contienen "user_":', userKeys);
    
    userKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value}`);
    });
    
    // Buscar específicamente pacientes
    const patientKeys = keys.filter(key => key.startsWith('user_role_'));
    console.log('Keys que empiezan con user_role_:', patientKeys);
    
    patientKeys.forEach(key => {
      const uid = key.replace('user_role_', '');
      const role = localStorage.getItem(key);
      const name = localStorage.getItem(`user_name_${uid}`);
      const surname = localStorage.getItem(`user_surname_${uid}`);
      
      console.log(`Usuario ${uid}: role=${role}, name=${name}, surname=${surname}`);
    });
    
    // Mostrar vitalytics-users
    const storedUsers = localStorage.getItem('vitalytics-users');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        console.log('vitalytics-users:', users);
        users.forEach((user: any) => {
          console.log(`Usuario en vitalytics-users: ${user.name} ${user.surname} (${user.uid}) - Role: ${user.role}`);
        });
      } catch (error) {
        console.error('Error parsing vitalytics-users:', error);
      }
    }
    
    alert('Revisa la consola del navegador para ver los detalles');
  };

  const createTestPatient = () => {
    const testUid = 'test-patient-' + Date.now();
    localStorage.setItem(`user_role_${testUid}`, 'patient');
    localStorage.setItem(`user_name_${testUid}`, 'Test');
    localStorage.setItem(`user_surname_${testUid}`, 'Patient');
    localStorage.setItem(`user_email_${testUid}`, 'test@example.com');
    
    alert('Paciente de prueba creado. Actualiza la página para verlo.');
    updateData();
  };

  const createTestPatientInAuthSystem = () => {
    const testUid = 'test-auth-patient-' + Date.now();
    const storedUsers = localStorage.getItem('vitalytics-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const newUser = {
      uid: testUid,
      email: 'test-auth@example.com',
      name: 'Test',
      surname: 'AuthPatient',
      role: 'patient',
      password: 'password123'
    };
    
    users.push(newUser);
    localStorage.setItem('vitalytics-users', JSON.stringify(users));
    
    alert('Paciente de prueba creado en el sistema de autenticación. Actualiza la página para verlo.');
    updateData();
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Debug: localStorage</h3>
      <div className="mb-4 space-x-2">
        <button 
          onClick={clearExamplePatients}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Limpiar pacientes de ejemplo
        </button>
        <button 
          onClick={clearAllPatients}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Limpiar TODOS los pacientes
        </button>
        <button 
          onClick={updateData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Actualizar
        </button>
        <button 
          onClick={runDebugCommand}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Ejecutar Debug
        </button>
        <button 
          onClick={createTestPatient}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Crear Paciente Test (Sistema Antiguo)
        </button>
        <button 
          onClick={createTestPatientInAuthSystem}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Crear Paciente Test (Sistema Auth)
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Keys de usuarios:</h4>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
            {localStorageData || 'No hay datos de usuarios'}
          </pre>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Todas las keys:</h4>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
            {allKeys || 'No hay keys'}
          </pre>
        </div>
        <div>
          <h4 className="font-semibold mb-2">vitalytics-users:</h4>
          <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
            {vitalyticsUsers || 'No hay datos'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugLocalStorage; 