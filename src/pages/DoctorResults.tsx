// Código corregido y limpio
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PatientDetailView from '@/components/PatientDetailView';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { getAllPatients } from '../services/userService';
import { getQuestionnairesByUserId } from '../services/questionnaireService';
import { usePatients } from '../hooks/usePatients';

interface PatientSummary {
  id: string;
  name: string;
  lastUpdate: string;
  condition: string;
  severity: number;
  date: string;
  userId: string;
  chatId?: string;
  behavioralData: {
    itchDuration: string;
    scratchSpeed: number;
    itchIntensity: number;
    itchFrequency: number;
    skinToNailVibrations: string;
  };
  sleepData: {
    posturalChanges: number;
    interruptions: number;
    qualityScore: number;
  };
  physiologicalData: {
    heartRate: number;
    heartRateVariability: number;
    skinConductance: number;
    skinTemperature: number;
  };
  clinicalData: {
    skinDiseaseHistory: string[];
    previousTreatments: string[];
    currentMedication: string[];
    treatmentResponse: string;
  };
}

const mockPatients: PatientSummary[] = [
  {
    id: "1747358548054",
    name: "Juan Pérez",
    lastUpdate: "2023-05-15",
    condition: "Intensidad de picor: 7/10",
    severity: 70,
    date: '',
    userId: '',
    behavioralData: {
      itchDuration: '',
      scratchSpeed: 0,
      itchIntensity: 0,
      itchFrequency: 0,
      skinToNailVibrations: ''
    },
    sleepData: {
      posturalChanges: 0,
      interruptions: 0,
      qualityScore: 0
    },
    physiologicalData: {
      heartRate: 0,
      heartRateVariability: 0,
      skinConductance: 0,
      skinTemperature: 0
    },
    clinicalData: {
      skinDiseaseHistory: [],
      previousTreatments: [],
      currentMedication: [],
      treatmentResponse: ''
    }
  },
  {
    id: "174734948054",
    name: "María García",
    lastUpdate: "2023-05-14",
    condition: "Intensidad de picor: 4/10",
    severity: 40,
    date: '',
    userId: '',
    behavioralData: {
      itchDuration: '',
      scratchSpeed: 0,
      itchIntensity: 0,
      itchFrequency: 0,
      skinToNailVibrations: ''
    },
    sleepData: {
      posturalChanges: 0,
      interruptions: 0,
      qualityScore: 0
    },
    physiologicalData: {
      heartRate: 0,
      heartRateVariability: 0,
      skinConductance: 0,
      skinTemperature: 0
    },
    clinicalData: {
      skinDiseaseHistory: [],
      previousTreatments: [],
      currentMedication: [],
      treatmentResponse: ''
    }
  },
  {
    id: "1343741548054",
    name: "Carlos López",
    lastUpdate: "2023-05-13",    condition: "Intesidad de picor: 6/10",
    severity: 60,
    date: '',
    userId: '',
    behavioralData: {
      itchDuration: '',
      scratchSpeed: 0,
      itchIntensity: 0,
      itchFrequency: 0,
      skinToNailVibrations: ''
    },
    sleepData: {
      posturalChanges: 0,
      interruptions: 0,
      qualityScore: 0
    },
    physiologicalData: {
      heartRate: 0,
      heartRateVariability: 0,
      skinConductance: 0,
      skinTemperature: 0
    },
    clinicalData: {
      skinDiseaseHistory: [],
      previousTreatments: [],
      currentMedication: [],
      treatmentResponse: ''
    }
  }
];

const getRegisteredPatients = async (): Promise<PatientSummary[]> => {
  try {
    // Obtener todos los pacientes del sistema de autenticación
    const storedUsers = localStorage.getItem('vitalytics-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const patients: PatientSummary[] = [];
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires = storedQuestionnaires ? JSON.parse(storedQuestionnaires) : [];

    for (const user of users) {
      if (user.role === 'patient') {
        // Buscar cuestionarios de este paciente
        const patientQuestionnaires = questionnaires.filter((q: any) => q.userId === user.uid);
        const latestQuestionnaire = patientQuestionnaires.length > 0
          ? patientQuestionnaires.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          : null;

        if (latestQuestionnaire && latestQuestionnaire.intensity !== undefined) {
          patients.push({
            id: user.uid,
            name: `${user.name} ${user.surname}`.trim(),
            lastUpdate: latestQuestionnaire.date || new Date().toISOString().split('T')[0],
            condition: `Intensidad del picor: ${latestQuestionnaire.intensity}/10`,
            severity: latestQuestionnaire.intensity * 10,
            date: latestQuestionnaire.date,
            userId: user.uid,
            behavioralData: {
              itchDuration: '',
              scratchSpeed: 0,
              itchIntensity: 0,
              itchFrequency: 0,
              skinToNailVibrations: ''
            },
            sleepData: {
              posturalChanges: 0,
              interruptions: 0,
              qualityScore: 0
            },
            physiologicalData: {
              heartRate: 0,
              heartRateVariability: 0,
              skinConductance: 0,
              skinTemperature: 0
            },
            clinicalData: {
              skinDiseaseHistory: [],
              previousTreatments: [],
              currentMedication: [],
              treatmentResponse: ''
            }
          });
        } else {
          // Paciente sin cuestionarios
          patients.push({
            id: user.uid,
            name: `${user.name} ${user.surname}`.trim(),
            lastUpdate: new Date().toISOString().split('T')[0],
            condition: 'Pendiente de evaluación',
            severity: 0,
            date: '',
            userId: user.uid,
            behavioralData: {
              itchDuration: '',
              scratchSpeed: 0,
              itchIntensity: 0,
              itchFrequency: 0,
              skinToNailVibrations: ''
            },
            sleepData: {
              posturalChanges: 0,
              interruptions: 0,
              qualityScore: 0
            },
            physiologicalData: {
              heartRate: 0,
              heartRateVariability: 0,
              skinConductance: 0,
              skinTemperature: 0
            },
            clinicalData: {
              skinDiseaseHistory: [],
              previousTreatments: [],
              currentMedication: [],
              treatmentResponse: ''
            }
          });
        }
      }
    }
    return patients;
  } catch (error) {
    console.error('Error al obtener pacientes registrados:', error);
    return [];
  }
};

const getRegisteredPatientsFromLocalStorage = (): PatientSummary[] => {
  try {
    const patients: PatientSummary[] = [];
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires = storedQuestionnaires ? JSON.parse(storedQuestionnaires) : [];

    console.log('Buscando pacientes en localStorage...');
    console.log('Cuestionarios encontrados:', questionnaires.length);

    // Intentar leer desde el sistema de autenticación
    const storedUsers = localStorage.getItem('vitalytics-users');
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        console.log('Usuarios encontrados en vitalytics-users:', users);
        
        users.forEach((user: any) => {
          if (user.role === 'patient') {
            console.log(`Procesando paciente: ${user.name} ${user.surname} (${user.uid})`);
            
            const patientQuestionnaires = questionnaires.filter(q => q.userId === user.uid);
            const latestQuestionnaire = patientQuestionnaires.length > 0 
              ? patientQuestionnaires.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
              : null;
            
            console.log(`Cuestionarios para ${user.name}:`, patientQuestionnaires.length);
            
            if (latestQuestionnaire && latestQuestionnaire.intensity !== undefined) {
              patients.push({
                id: user.uid,
                name: `${user.name} ${user.surname}`.trim(),
                lastUpdate: latestQuestionnaire.date || new Date().toISOString().split('T')[0],
                condition: `Intensidad del picor: ${latestQuestionnaire.intensity}/10`,
                severity: latestQuestionnaire.intensity * 10,
                date: latestQuestionnaire.date,
                userId: user.uid,
                behavioralData: {
                  itchDuration: '',
                  scratchSpeed: 0,
                  itchIntensity: 0,
                  itchFrequency: 0,
                  skinToNailVibrations: ''
                },
                sleepData: {
                  posturalChanges: 0,
                  interruptions: 0,
                  qualityScore: 0
                },
                physiologicalData: {
                  heartRate: 0,
                  heartRateVariability: 0,
                  skinConductance: 0,
                  skinTemperature: 0
                },
                clinicalData: {
                  skinDiseaseHistory: [],
                  previousTreatments: [],
                  currentMedication: [],
                  treatmentResponse: ''
                }
              });
            } else {
              // Paciente sin cuestionarios
              patients.push({
                id: user.uid,
                name: `${user.name} ${user.surname}`.trim(),
                lastUpdate: new Date().toISOString().split('T')[0],
                condition: 'Pendiente de evaluación',
                severity: 50,
                date: '',
                userId: user.uid,
                behavioralData: {
                  itchDuration: '',
                  scratchSpeed: 0,
                  itchIntensity: 0,
                  itchFrequency: 0,
                  skinToNailVibrations: ''
                },
                sleepData: {
                  posturalChanges: 0,
                  interruptions: 0,
                  qualityScore: 0
                },
                physiologicalData: {
                  heartRate: 0,
                  heartRateVariability: 0,
                  skinConductance: 0,
                  skinTemperature: 0
                },
                clinicalData: {
                  skinDiseaseHistory: [],
                  previousTreatments: [],
                  currentMedication: [],
                  treatmentResponse: ''
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Error parsing vitalytics-users:', error);
      }
    }

    // También buscar en el sistema antiguo (keys individuales) por compatibilidad
    const keys = Object.keys(localStorage);
    console.log('Keys encontradas:', keys.filter(key => key.startsWith('user_role_')));
    
    keys.forEach(key => {
      if (key.startsWith('user_role_')) {
        const uid = key.replace('user_role_', '');
        const role = localStorage.getItem(key);
        
        if (role === 'patient') {
          const name = localStorage.getItem(`user_name_${uid}`) || '';
          const surname = localStorage.getItem(`user_surname_${uid}`) || '';
          
          console.log(`Procesando paciente (sistema antiguo): ${name} ${surname} (${uid})`);
          
          // Solo procesar si tiene nombre y apellido y no está ya en la lista
          if (name && surname && !patients.some(p => p.id === uid)) {
            const patientQuestionnaires = questionnaires.filter(q => q.userId === uid);
            const latestQuestionnaire = patientQuestionnaires.length > 0 
              ? patientQuestionnaires.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
              : null;
            
            console.log(`Cuestionarios para ${name}:`, patientQuestionnaires.length);
            
            if (latestQuestionnaire && latestQuestionnaire.intensity !== undefined) {
              patients.push({
                id: uid,
                name: `${name} ${surname}`.trim(),
                lastUpdate: latestQuestionnaire.date || new Date().toISOString().split('T')[0],
                condition: `Intensidad del picor: ${latestQuestionnaire.intensity}/10`,
                severity: latestQuestionnaire.intensity * 10,
                date: latestQuestionnaire.date,
                userId: uid,
                behavioralData: {
                  itchDuration: '',
                  scratchSpeed: 0,
                  itchIntensity: 0,
                  itchFrequency: 0,
                  skinToNailVibrations: ''
                },
                sleepData: {
                  posturalChanges: 0,
                  interruptions: 0,
                  qualityScore: 0
                },
                physiologicalData: {
                  heartRate: 0,
                  heartRateVariability: 0,
                  skinConductance: 0,
                  skinTemperature: 0
                },
                clinicalData: {
                  skinDiseaseHistory: [],
                  previousTreatments: [],
                  currentMedication: [],
                  treatmentResponse: ''
                }
              });
            } else {
              // Paciente sin cuestionarios
              patients.push({
                id: uid,
                name: `${name} ${surname}`.trim(),
                lastUpdate: new Date().toISOString().split('T')[0],
                condition: 'Pendiente de evaluación',
                severity: 50,
                date: '',
                userId: uid,
                behavioralData: {
                  itchDuration: '',
                  scratchSpeed: 0,
                  itchIntensity: 0,
                  itchFrequency: 0,
                  skinToNailVibrations: ''
                },
                sleepData: {
                  posturalChanges: 0,
                  interruptions: 0,
                  qualityScore: 0
                },
                physiologicalData: {
                  heartRate: 0,
                  heartRateVariability: 0,
                  skinConductance: 0,
                  skinTemperature: 0
                },
                clinicalData: {
                  skinDiseaseHistory: [],
                  previousTreatments: [],
                  currentMedication: [],
                  treatmentResponse: ''
                }
              });
            }
          }
        }
      }
    });

    console.log('Pacientes encontrados en localStorage:', patients.length);
    return patients;
  } catch (error) {
    console.error('Error al obtener pacientes de localStorage:', error);
    return [];
  }
};

const DoctorResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [allPatients, setAllPatients] = useState<PatientSummary[]>([]);
  const { patients: registeredPatients, isLoading: patientsLoading } = usePatients();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const registeredPatientsData = await getRegisteredPatients();
        setAllPatients(registeredPatientsData);
      } catch (error) {
        console.error('Error loading patients:', error);
        setAllPatients([]);
      }
    };
    loadPatients();
  }, [registeredPatients]);

  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" />;
  }

  const filteredPatients = allPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {selectedPatient && (
          <PatientDetailView
            patient={selectedPatient}
            onClose={() => setSelectedPatient(null)}
          />
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Resultados de Pacientes</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Visualice y analice los resultados de sus pacientes para un mejor seguimiento de su condición.
        </p>

        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buscar Pacientes</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, ID o condición..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {patientsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500"></div>
              <span className="ml-3 text-gray-600">Cargando pacientes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <motion.div
                  key={patient.id}
                  className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">ID: {patient.id}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.severity >= 70 ? 'bg-red-100 text-red-800' :
                        patient.severity >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.severity >= 70 ? 'Alta' :
                         patient.severity >= 40 ? 'Media' : 'Baja'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                      <p className="text-xs text-gray-500">Última actualización: {patient.lastUpdate}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Severidad</span>
                        <span>{patient.severity}%</span>
                      </div>
                      <Progress value={patient.severity} className="h-2" />
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const chatKey = `chat_${[patient.id, user.uid].sort().join('_')}`;
                          navigate('/mensajes', { state: { patientId: patient.id, doctorId: user.uid, chatKey } });
                        }}
                        className="text-softGreen-600 border-softGreen-500 hover:bg-softGreen-50"
                      >
                        Chat
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!patientsLoading && filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron pacientes que coincidan con tu búsqueda.</p>
              <Button onClick={() => setSearchTerm('')} variant="outline">
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DoctorResults;