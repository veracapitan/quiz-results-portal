import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend
);

interface TreatmentEfficacyChartProps {
  patientId: string;
  treatmentEfficacy: number; // Valor entre 0 y 10
}

const TreatmentEfficacyChart: React.FC<TreatmentEfficacyChartProps> = ({ 
  patientId, 
  treatmentEfficacy = 6 // Valor por defecto
}) => {
  // Calculamos el porcentaje de eficacia
  const efficacyPercentage = treatmentEfficacy * 10;
  
  const data = {
    labels: ['Eficacia', 'Margen de mejora'],
    datasets: [
      {
        label: 'Porcentaje',
        data: [efficacyPercentage, 100 - efficacyPercentage],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(220, 220, 220, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(220, 220, 220, 1)',
        ],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Eficacia del Tratamiento Actual',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md text-center">
      <Doughnut data={data} options={options} />
      <div className="mt-4 text-2xl font-bold text-gray-700">
        {efficacyPercentage}%
      </div>
      <div className="text-sm text-gray-500">
        Eficacia reportada por el paciente
      </div>
    </div>
  );
};

export default TreatmentEfficacyChart;