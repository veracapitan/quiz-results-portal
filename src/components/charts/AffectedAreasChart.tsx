import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend
);

interface AffectedAreasChartProps {
  patientId: string;
}

const AffectedAreasChart: React.FC<AffectedAreasChartProps> = ({ patientId }) => {
  // Datos simulados para la gráfica
  const areas = [
    'Cabeza/Cuero cabelludo',
    'Cara',
    'Pecho',
    'Abdomen',
    'Espalda',
    'Brazos',
    'Manos',
    'Piernas',
    'Pies'
  ];
  
  // Frecuencia con la que cada área ha sido reportada (porcentaje)
  const frequencyData = [45, 60, 30, 25, 70, 55, 40, 65, 20];
  
  const data = {
    labels: areas,
    datasets: [
      {
        label: 'Frecuencia de Afectación (%)',
        data: frequencyData,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Áreas Más Afectadas por el Picor',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Frecuencia (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Área Corporal'
        }
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AffectedAreasChart;