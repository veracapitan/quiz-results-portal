import React from 'react';
import { Pie } from 'react-chartjs-2';
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

interface TriggerFactorsChartProps {
  patientId: string;
}

const TriggerFactorsChart: React.FC<TriggerFactorsChartProps> = ({ patientId }) => {
  // Datos simulados para la gráfica
  const triggers = [
    'Noche',
    'Estrés',
    'Sudoración',
    'Alimentos',
    'Productos de higiene',
    'Sin patrón claro'
  ];
  
  // Porcentaje de cada factor desencadenante
  const triggerData = [35, 20, 15, 10, 12, 8];
  
  const data = {
    labels: triggers,
    datasets: [
      {
        label: 'Porcentaje',
        data: triggerData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Factores Desencadenantes del Picor',
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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Pie data={data} options={options} />
    </div>
  );
};

export default TriggerFactorsChart;