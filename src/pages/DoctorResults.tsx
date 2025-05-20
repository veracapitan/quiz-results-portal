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
    lastUpdate: "2023-05-13",
    condition: "Intesidad de picor: 6/10",
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

const getRegisteredPatients = (): PatientSummary[] => {
  try {
    const patients: PatientSummary[] = [];
    const keys = Object.keys(localStorage);
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires = storedQuestionnaires ? JSON.parse(storedQuestionnaires) : [];

    keys.forEach(key => {
      if (key.startsWith('user_role_')) {
        const uid = key.replace('user_role_', '');
        const role = localStorage.getItem(key);
        if (role === 'patient') {
          const name = localStorage.getItem(`user_name_${uid}`) || '';
          const surname = localStorage.getItem(`user_surname_${uid}`) || '';
          const patientQuestionnaires = questionnaires.filter(q => q.userId === uid);
          const latestQuestionnaire = patientQuestionnaires.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          if (latestQuestionnaire && latestQuestionnaire.intensity !== undefined) {
            patients.push({
              id: uid,
              name: `${name} ${surname}`.trim(),
              lastUpdate: latestQuestionnaire.date || new Date().toISOString().split('T')[0],
              condition: `Intensidad del picor: ${latestQuestionnaire.intensity}/10`,
              severity: latestQuestionnaire.intensity * 10,
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
            });
          } else {
            patients.push({
              id: uid,
              name: `${name} ${surname}`.trim(),
              lastUpdate: new Date().toISOString().split('T')[0],
              condition: 'Pendiente de evaluación',
              severity: 50,
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
            });
          }
        }
      }
    });

    return patients;
  } catch (error) {
    console.error('Error al obtener pacientes registrados:', error);
    return [];
  }
};

const DoctorResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [allPatients, setAllPatients] = useState<PatientSummary[]>([]);

  useEffect(() => {
    const registeredPatients = getRegisteredPatients();
    const combinedPatients = [...mockPatients, ...registeredPatients];
    setAllPatients(combinedPatients);
  }, []);

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

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Resultados de Pacientes</h1>
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

          <div className="grid gap-6">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient.id}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{patient.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>ID: {patient.id}</span>
                      <span>•</span>
                      <span>Última actualización: {patient.lastUpdate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full mb-1 border ${patient.severity >= 70 ? 'bg-red-500 border-red-700' : patient.severity >= 40 ? 'bg-yellow-500 border-yellow-700' : 'bg-green-500 border-green-700'}`}></div>
                      <span className="text-xs text-gray-500">
                        {patient.severity >= 70 ? 'Alto' : patient.severity >= 40 ? 'Medio' : 'Bajo'}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="border" 
                      onClick={() => {
                        if (!user || !patient.id) return;
                        
                        // Crear una clave única para el chat que incluya ambos IDs
                        const chatKey = `chat_${patient.id}_${user.uid}`;
                        
                        // Navegar a la página de mensajes con todos los parámetros necesarios
                        navigate('/mensajes', {
                          state: { 
                            patientId: patient.id,
                            doctorId: user.uid,
                            chatKey: chatKey
                          }
                        });
                      }}
                    >
                      Chat
                    </Button>
                    <Button
                      onClick={() => setSelectedPatient(patient)}
                      className="bg-softGreen-500 hover:bg-softGreen-600"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{patient.condition}</span>
                    <span className="text-sm text-gray-600">
                      Intensidad: {patient.severity}%
                    </span>
                  </div>
                  <Progress value={patient.severity} className="h-2" />
            </div>
            
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorResults;