import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Heart, Thermometer } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ItchIntensityScale } from './ui/itch-intensity-scale';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import PatientChart from './PatientChart';

interface PatientData {
  id: string;
  date: string;
  userId: string;
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
  images?: string[];
}

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
  images?: string[];
  userId: string;
}

interface PatientDetailViewProps {
  patient: PatientData;
  onClose: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onClose }) => {
  const { user } = useAuth();
  // Get questionnaire data for this patient
  const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
  const questionnaires: QuestionnaireData[] = storedQuestionnaires ? JSON.parse(storedQuestionnaires) : [];
  const patientQuestionnaires = questionnaires.filter(q => q.userId === patient.userId);
  const latestQuestionnaire = patientQuestionnaires[0]; // Most recent questionnaire
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-4 px-4 sm:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-5xl h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center border-b pb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Análisis Detallado del Paciente</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>



        {/* Funcionalidades Interactivas para el Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user?.role !== 'doctor' && (
            <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Contactar al Médico</h3>
              <p className="text-gray-700 mb-4">
                Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con tu médico.
              </p>
              <Button className="w-full bg-softGreen-600 hover:bg-softGreen-700">
                Enviar Mensaje al Médico
              </Button>
            </div>
          )}

          {/* Otras Funcionalidades (Placeholder) */}
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Próximas Funcionalidades</h3>
            <p className="text-gray-700">
              Estamos trabajando en nuevas herramientas para ayudarte a gestionar mejor tu salud.
              ¡Vuelve pronto para ver las novedades!
            </p>
            {/* Aquí se podrían añadir más elementos interactivos en el futuro */}
          </div>

          {/* Environmental Factors (Se mantiene esta sección si se considera útil) */}
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <Thermometer className="h-6 w-6 text-softGreen-700" />
              <h3 className="text-xl font-semibold text-gray-900">Factores Ambientales</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Temperatura Ambiente</span>
                  <span className="font-semibold text-xl text-gray-900">24°C</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Humedad</span>
                  <span className="font-semibold text-xl text-gray-900">65%</span>
                </div>
              </div>
              <PatientChart
                data={[
                  { name: 'Lun', value: 65 },
                  { name: 'Mar', value: 68 },
                  { name: 'Mie', value: 62 },
                  { name: 'Jue', value: 70 },
                  { name: 'Vie', value: 63 }
                ]}
                title="Humedad Ambiental (Semana)"
                yAxisLabel="%"
                color="#0ea5e9"
              />
            </div>
          </div>
        </div>

        {/* Clinical History */}
        <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Historial Clínico</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Historial de Enfermedades de la Piel</h4>
              <div className="flex flex-wrap gap-2">
                {patient.clinicalData.skinDiseaseHistory.map((disease, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                    {disease}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Tratamientos Previos</h4>
              <div className="flex flex-wrap gap-2">
                {patient.clinicalData.previousTreatments.map((treatment, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                    {treatment}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Medicación Actual</h4>
              <div className="flex flex-wrap gap-2">
                {patient.clinicalData.currentMedication.map((medication, index) => (
                  <span key={index} className="px-3 py-1 bg-softGreen-100 text-softGreen-700 rounded-full text-sm">
                    {medication}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-3">Respuesta al Tratamiento</h4>
              <p className="text-gray-700">{patient.clinicalData.treatmentResponse}</p>
            </div>
          </div>
        </div>

        {/* Questionnaire History */}
        <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Historial de Cuestionarios</h3>
          <div className="space-y-6">
            {patientQuestionnaires.map((questionnaire, index) => (
              <div key={questionnaire.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      Cuestionario {patientQuestionnaires.length - index}
                    </h4>
                    <p className="text-sm text-gray-600">{new Date(questionnaire.date).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-600">Intensidad del Picor</span>
                    <div className="text-xl font-semibold text-gray-900">{questionnaire.intensity}/10</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Áreas Afectadas</h5>
                    <div className="flex flex-wrap gap-2">
                      {questionnaire.selectedAreas.map((area, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Desencadenantes</h5>
                    <div className="flex flex-wrap gap-2">
                      {questionnaire.triggers.map((trigger, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 text-sm">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Impacto en Actividades</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-gray-600 mb-1">Ocio/Social</span>
                        <span className="font-medium text-gray-900 capitalize">{questionnaire.activitiesImpact.leisureSocial}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-gray-600 mb-1">Tareas/Mandados</span>
                        <span className="font-medium text-gray-900 capitalize">{questionnaire.activitiesImpact.houseworkErrands}</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="block text-xs text-gray-600 mb-1">Trabajo/Escuela</span>
                        <span className="font-medium text-gray-900 capitalize">{questionnaire.activitiesImpact.workSchool}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Eficacia del Tratamiento</h5>
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-softGreen-500"
                            style={{ width: `${(questionnaire.treatmentEfficacy / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{questionnaire.treatmentEfficacy}/10</span>
                    </div>
                  </div>
                </div>

                {questionnaire.images && questionnaire.images.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Imágenes Adjuntas</h5>
                    <div className="flex flex-wrap gap-2">
                      {questionnaire.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Imagen ${idx + 1} del cuestionario`}
                          className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Patient Images - Moved to bottom and only shown if images exist */}
        {((patient.images && patient.images.length > 0) || (latestQuestionnaire?.images && latestQuestionnaire.images.length > 0)) && (
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Imágenes del Paciente</h3>
            <div className="flex flex-wrap gap-4">
              {patient.images?.map((image, index) => (
                <img
                  key={`mock-${index}`}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                />
              ))}
              {latestQuestionnaire?.images?.map((image, index) => (
                <img
                  key={`questionnaire-${index}`}
                  src={image}
                  alt={`Imagen del cuestionario ${index + 1}`}
                  className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PatientDetailView;