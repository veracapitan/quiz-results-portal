import React from 'react';
import { Heart, Thermometer, Activity, Droplets } from 'lucide-react';

interface PhysiologicalDataCardProps {
  patientId: string;
}

const PhysiologicalDataCard: React.FC<PhysiologicalDataCardProps> = ({ patientId }) => {
  // Datos simulados
  const physiologicalData = {
    heartRate: 72, // latidos por minuto
    heartRateVariability: 65, // ms
    skinTemperature: 32.5, // °C
    skinConductance: 8.3, // µS (microsiemens)
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Datos Fisiológicos (Wearable)</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Heart className="text-red-500" />
          <div>
            <p className="text-sm text-gray-500">Ritmo Cardíaco</p>
            <p className="font-medium">{physiologicalData.heartRate} BPM</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Activity className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Variabilidad Cardíaca</p>
            <p className="font-medium">{physiologicalData.heartRateVariability} ms</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Thermometer className="text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Temperatura Cutánea</p>
            <p className="font-medium">{physiologicalData.skinTemperature} °C</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Droplets className="text-purple-500" />
          <div>
            <p className="text-sm text-gray-500">Conductancia Cutánea</p>
            <p className="font-medium">{physiologicalData.skinConductance} µS</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Datos registrados por dispositivo wearable en las últimas 24 horas</p>
      </div>
    </div>
  );
};

export default PhysiologicalDataCard;