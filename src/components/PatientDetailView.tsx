import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Heart, Thermometer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

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
}

interface PatientDetailViewProps {
  patient: PatientData;
  onClose: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onClose }) => {
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

        {/* Scratch Pattern Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Patrón de Rascado</h3>
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-6 flex items-center justify-center">
              <Activity className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración del Rascado:</span>
                <span className="font-medium text-gray-900">{patient.behavioralData.itchDuration}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Intensidad:</span>
                  <span className="font-medium text-gray-900">{patient.behavioralData.itchIntensity}/10</span>
                </div>
                <Progress value={patient.behavioralData.itchIntensity * 10} className="h-3" />
              </div>
            </div>
          </div>

          {/* Sleep Quality Assessment */}
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-6 w-6 text-softGreen-700" />
              <h3 className="text-xl font-semibold text-gray-900">Calidad del Sueño</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Calidad General:</span>
                  <span className="font-medium text-gray-900">{patient.sleepData.qualityScore}%</span>
                </div>
                <Progress value={patient.sleepData.qualityScore} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Interrupciones</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.sleepData.interruptions}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Cambios Posturales</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.sleepData.posturalChanges}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Physiological Data */}
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <Heart className="h-6 w-6 text-softGreen-700" />
              <h3 className="text-xl font-semibold text-gray-900">Datos Fisiológicos</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Ritmo Cardíaco</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.physiologicalData.heartRate} BPM</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Variabilidad</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.physiologicalData.heartRateVariability}ms</span>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-6">
              <Thermometer className="h-6 w-6 text-softGreen-700" />
              <h3 className="text-xl font-semibold text-gray-900">Factores Ambientales</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Temperatura</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.physiologicalData.skinTemperature}°C</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <span className="block text-gray-600 text-sm mb-1">Conductancia</span>
                  <span className="font-semibold text-xl text-gray-900">{patient.physiologicalData.skinConductance} µS</span>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical History */}
        <div className="glass-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Historial Clínico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 text-gray-900">Historial de Condiciones</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {patient.clinicalData.skinDiseaseHistory.map((condition, index) => (
                  <li key={index} className="text-gray-600">{condition}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3 text-gray-900">Medicación Actual</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {patient.clinicalData.currentMedication.map((medication, index) => (
                  <li key={index} className="text-gray-600">{medication}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3 text-gray-900">Respuesta al Tratamiento</h4>
            <p className="text-sm text-gray-600">{patient.clinicalData.treatmentResponse}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PatientDetailView;