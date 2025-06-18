import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Heart, Thermometer } from 'lucide-react';
import Layout from '@/components/Layout';
import PatientChart from '@/components/PatientChart';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import AppointmentForm, { AppointmentFormData } from '@/components/AppointmentForm';
import { getQuestionnairesByUserId } from '../services/questionnaireService';

interface QuestionnaireData {
  id: string;
  date: string;
  intensity: number;
  selectedAreas: string[];
  activitiesImpact: {
    leisureSocial: string;
    houseworkErrands: string;
    workSchool: string;
  };
  triggers: string[];
  treatmentEfficacy: number;
  imageCount: number;
  userId: string;
}

const PatientResults = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<QuestionnaireData[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (user) {
          // Intentar obtener datos de la base de datos
          const result = await getQuestionnairesByUserId(user.uid);
          
          if (result.success) {
            setPatientData(result.questionnaires);
          } else {
            // Si hay un error con la base de datos, intentar con localStorage
            const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
            if (storedQuestionnaires) {
              const allQuestionnaires: QuestionnaireData[] = JSON.parse(storedQuestionnaires);
              const userQuestionnaires = allQuestionnaires
                .filter(q => q.userId === user.uid)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              setPatientData(userQuestionnaires);
            } else {
              setPatientData([]);
            }
          }
        } else {
          setPatientData([]);
        }
      } catch (error) {
        console.error('Error loading questionnaires:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setPatientData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Redirect if not a patient
  if (!user || user.role !== 'patient') {
    return <Navigate to="/" />;
  }

  // Calculate averages and prepare chart data
  const intensityData = patientData.slice(-5).map(q => ({
    name: new Date(q.date).toLocaleDateString('es-ES', { weekday: 'short' }),
    value: q.intensity
  }));

  const treatmentData = patientData.slice(-5).map(q => ({
    name: new Date(q.date).toLocaleDateString('es-ES', { weekday: 'short' }),
    value: q.treatmentEfficacy
  }));

  const activityImpactData = patientData.slice(-5).map(q => ({
    name: new Date(q.date).toLocaleDateString('es-ES', { weekday: 'short' }),
    leisureSocial: q.activitiesImpact.leisureSocial === 'high' ? 3 : q.activitiesImpact.leisureSocial === 'medium' ? 2 : 1,
    houseworkErrands: q.activitiesImpact.houseworkErrands === 'high' ? 3 : q.activitiesImpact.houseworkErrands === 'medium' ? 2 : 1,
    workSchool: q.activitiesImpact.workSchool === 'high' ? 3 : q.activitiesImpact.workSchool === 'medium' ? 2 : 1
  }));

  const triggersCount = patientData.reduce((acc, curr) => {
    curr.triggers.forEach(trigger => {
      acc[trigger] = (acc[trigger] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const averageIntensity = patientData.length > 0
    ? Math.round(patientData.reduce((acc, curr) => acc + curr.intensity, 0) / patientData.length)
    : 0;

  const averageTreatmentEfficacy = patientData.length > 0
    ? Math.round(patientData.reduce((acc, curr) => acc + curr.treatmentEfficacy, 0) / patientData.length)
    : 0;

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
        <motion.section 
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block px-2 sm:px-3 py-1 rounded-full bg-softGreen-100 text-softGreen-700 text-xs sm:text-sm font-medium mb-2 sm:mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Servicios Médicos
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Servicios Médicos</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Gestiona tus citas y mensajes médicos.
          </p>
        </motion.section>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Agendar una Cita</h3>
            <p className="text-sm text-gray-600 mb-4">Selecciona una fecha y hora para tu próxima consulta médica.</p>
            <AppointmentForm 
              patientId={user?.uid || ''}
              doctors={[
                { id: '1', name: 'Dr. Juan Pérez', specialty: 'Dermatología' },
                { id: '2', name: 'Dra. María López', specialty: 'Cardiología' }
              ]}
              onSuccess={() => navigate('/mis-citas')} 
              onSubmit={function (data: AppointmentFormData): void {
                throw new Error('Function not implemented.');
              }} 
              onCancel={function (): void {
                throw new Error('Function not implemented.');
              }}            
            />
          </motion.div>

          <motion.div
            className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Enviar Mensaje</h3>
            <p className="text-sm text-gray-600 mb-4">Comunícate con tu médico mediante mensajes directos dentro de la plataforma.</p>
            <button
              onClick={() => navigate('/mensajes', { state: { newChat: true } })}
              className="bg-softGreen-600 text-white px-4 py-2 rounded-lg hover:bg-softGreen-700 transition"
            >
              Ir a Mensajes
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientResults;