import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getQuestionnairesByUserId } from '../services/questionnaireService';
import PatientChart from '@/components/PatientChart';

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

const HistorialCuestionarios = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<QuestionnaireData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <motion.section 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-softGreen-100 text-softGreen-700 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Historial Médico
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Historial de Cuestionarios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revise su historial de evaluaciones y el progreso de su condición a lo largo del tiempo.
          </p>
        </motion.section>

        {patientData.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay cuestionarios registrados</h3>
            <p className="text-gray-600 mb-6">
              Complete su primer cuestionario para comenzar a registrar su progreso.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Estadísticas generales */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-softGreen-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-softGreen-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Evaluaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{patientData.length}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Intensidad Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{averageIntensity}/10</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Eficacia Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">{averageTreatmentEfficacy}/10</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gráficos */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Evolución de la Intensidad</h3>
                <PatientChart data={intensityData} title="Intensidad del Picor" />
              </div>

              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Eficacia del Tratamiento</h3>
                <PatientChart data={treatmentData} title="Eficacia del Tratamiento" />
              </div>
            </motion.div>

            {/* Lista de cuestionarios */}
            <motion.div
              className="glass-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">Cuestionarios Recientes</h3>
              <div className="space-y-4">
                {patientData.slice(0, 5).map((questionnaire, index) => (
                  <div key={questionnaire.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-softGreen-600">#{patientData.length - index}</div>
                      <div>
                        <p className="font-medium">
                          {new Date(questionnaire.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Intensidad: {questionnaire.intensity}/10 | Eficacia: {questionnaire.treatmentEfficacy}/10
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`w-4 h-4 rounded-full ${
                        questionnaire.intensity >= 7 ? 'bg-red-500' :
                        questionnaire.intensity >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default HistorialCuestionarios; 