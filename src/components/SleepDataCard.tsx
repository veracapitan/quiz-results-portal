import React from 'react';
import { Moon, Clock, RotateCcw, Star } from 'lucide-react';

interface SleepDataCardProps {
  patientId: string;
}

const SleepDataCard: React.FC<SleepDataCardProps> = ({ patientId }) => {
  // Datos simulados
  const sleepData = {
    totalSleepTime: 6.5, // horas
    posturalChanges: 12, // número de cambios
    interruptions: 3, // número de interrupciones
    qualityScore: 68, // puntuación de 0 a 100
    itchEpisodesDuringSleep: 2, // episodios de picor durante el sueño
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Datos de Sueño</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Clock className="text-indigo-500" />
          <div>
            <p className="text-sm text-gray-500">Tiempo Total</p>
            <p className="font-medium">{sleepData.totalSleepTime} horas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <RotateCcw className="text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Cambios Posturales</p>
            <p className="font-medium">{sleepData.posturalChanges} cambios</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Moon className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Interrupciones</p>
            <p className="font-medium">{sleepData.interruptions} veces</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Star className="text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Calidad</p>
            <p className="font-medium">{sleepData.qualityScore}/100</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-amber-50 rounded-md">
        <p className="text-sm font-medium text-amber-700">
          Se detectaron {sleepData.itchEpisodesDuringSleep} episodios de picor durante el sueño
        </p>
      </div>
    </div>
  );
};

export default SleepDataCard;