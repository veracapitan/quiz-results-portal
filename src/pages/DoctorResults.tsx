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
    id: '1',
    name: 'Ana García',
    lastUpdate: '2024-03-15',
    condition: 'Dermatitis Atópica',
    severity: 70,
    date: '2024-03-15',
    userId: '1',
    behavioralData: {
      itchDuration: '2-4 horas',
      scratchSpeed: 75,
      itchIntensity: 7,
      itchFrequency: 8,
      skinToNailVibrations: 'Moderadas'
    },
    sleepData: {
      posturalChanges: 12,
      interruptions: 4,
      qualityScore: 6
    },
    physiologicalData: {
      heartRate: 72,
      heartRateVariability: 65,
      skinConductance: 8.3,
      skinTemperature: 32.5
    },
    clinicalData: {
      skinDiseaseHistory: [
        'Diagnóstico inicial de Dermatitis Atópica en 2018',
        'Episodio severo de eccema en verano 2020',
        'Brote alérgico por contacto con níquel en 2021',
        'Mejoría significativa tras cambio de tratamiento en 2022'
      ],
      previousTreatments: [
        'Hidrocortisona 1% (2018-2020)',
        'Tacrolimus 0.1% (2020-2021)',
        'Fototerapia UVB (2021)',
        'Dupixent (2022-presente)'
      ],
      currentMedication: [
        'Dupixent 300mg cada 2 semanas',
        'Cetirizina 10mg diarios',
        'Crema hidratante CeraVe 2 veces al día',
        'Betametasona 0.05% para brotes'
      ],
      treatmentResponse: 'Buena respuesta a Dupixent con reducción significativa de brotes. Ocasionalmente requiere corticoides tópicos para exacerbaciones.'
    }
  },
  {
    id: '2',
    name: 'Carlos Martínez',
    lastUpdate: '2024-03-14',
    condition: 'Psoriasis',
    severity: 85,
    date: '2024-03-14',
    userId: '2',
    behavioralData: {
      itchDuration: '4-6 horas',
      scratchSpeed: 85,
      itchIntensity: 8,
      itchFrequency: 9,
      skinToNailVibrations: 'Altas'
    },
    sleepData: {
      posturalChanges: 15,
      interruptions: 6,
      qualityScore: 4
    },
    physiologicalData: {
      heartRate: 78,
      heartRateVariability: 58,
      skinConductance: 9.1,
      skinTemperature: 33.2
    },
    clinicalData: {
      skinDiseaseHistory: [
        'Diagnóstico de Psoriasis en placas en 2015',
        'Artritis psoriásica diagnosticada en 2017',
        'Hospitalización por brote severo en 2019',
        'Remisión parcial alcanzada en 2023'
      ],
      previousTreatments: [
        'Metotrexato oral (2015-2017)',
        'Ciclosporina (2017-2019)',
        'Fototerapia PUVA (2019)',
        'Humira (2020-2022)'
      ],
      currentMedication: [
        'Skyrizi 150mg cada 12 semanas',
        'Naproxeno 500mg para dolor articular',
        'Ungüento de calcipotriol/betametasona',
        'Crema hidratante específica para psoriasis'
      ],
      treatmentResponse: 'Excelente respuesta a Skyrizi con remisión del 90% de las placas. Artritis psoriásica bien controlada con tratamiento actual.'
    }
  },
  {
    id: '3',
    name: 'María Sánchez',
    lastUpdate: '2024-03-13',
    condition: 'Rosácea',
    severity: 60,
    date: '2024-03-13',
    userId: '3',
    behavioralData: {
      itchDuration: '1-2 horas',
      scratchSpeed: 45,
      itchIntensity: 5,
      itchFrequency: 6,
      skinToNailVibrations: 'Bajas'
    },
    sleepData: {
      posturalChanges: 8,
      interruptions: 2,
      qualityScore: 7
    },
    physiologicalData: {
      heartRate: 68,
      heartRateVariability: 72,
      skinConductance: 7.5,
      skinTemperature: 31.8
    },
    clinicalData: {
      skinDiseaseHistory: [
        'Diagnóstico de Rosácea tipo 2 en 2019',
        'Episodios de enrojecimiento severo en 2020',
        'Desarrollo de telangiectasias en 2021',
        'Mejoría notable con láser vascular en 2022'
      ],
      previousTreatments: [
        'Metronidazol tópico 0.75% (2019-2020)',
        'Doxiciclina oral (2020)',
        'Ácido azelaico 15% (2021)',
        'Tratamiento con láser vascular (2022)'
      ],
      currentMedication: [
        'Ivermectina crema 1% diaria',
        'Brimonidina gel 0.33% para enrojecimiento',
        'Protector solar mineral SPF 50',
        'Limpiador suave sin jabón'
      ],
      treatmentResponse: 'Respuesta favorable a la combinación de tratamientos tópicos. Control adecuado de brotes con manejo de factores desencadenantes.'
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
            
            if (latestQuestionnaire) {
              const formattedDate = new Date(latestQuestionnaire.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              });

              patients.push({
                id: user.uid,
                name: `${user.name} ${user.surname}`.trim(),
                lastUpdate: formattedDate,
                condition: `Intensidad del picor: ${latestQuestionnaire.intensity}/10`,
                severity: latestQuestionnaire.intensity * 10,
                date: formattedDate,
                userId: user.uid,
                behavioralData: latestQuestionnaire.behavioralData || {
                  itchDuration: '',
                  scratchSpeed: 0,
                  itchIntensity: 0,
                  itchFrequency: 0,
                  skinToNailVibrations: ''
                },
                sleepData: latestQuestionnaire.sleepData || {
                  posturalChanges: 0,
                  interruptions: 0,
                  qualityScore: 0
                },
                physiologicalData: latestQuestionnaire.physiologicalData || {
                  heartRate: 0,
                  heartRateVariability: 0,
                  skinConductance: 0,
                  skinTemperature: 0
                },
                clinicalData: latestQuestionnaire.clinicalData || {
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
        console.error('Error procesando usuarios:', error);
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
        // Unir mockPatients y pacientes reales, eliminando duplicados por id
        const all = [...mockPatients, ...registeredPatientsData];
        const uniquePatients = all.filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx && p.name && p.name.trim() !== '' && p.id && p.id.trim() !== '');
        setAllPatients(uniquePatients);
      } catch (error) {
        console.error('Error loading patients:', error);
        setAllPatients(mockPatients);
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