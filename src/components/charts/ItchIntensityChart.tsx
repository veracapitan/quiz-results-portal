import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

interface ItchIntensityChartProps {
  patientId: string;
}

const ItchIntensityChart: React.FC<ItchIntensityChartProps> = ({ patientId }) => {
  // Datos simulados para la gráfica
  const dates = [
    '1 Ene', '8 Ene', '15 Ene', '22 Ene', '29 Ene', 
    '5 Feb', '12 Feb', '19 Feb', '26 Feb', '5 Mar'
  ];
  
  // Simulamos datos de intensidad del picor (escala 0-10)
  const intensityData = [7, 8, 6, 5, 7, 4, 3, 5, 4, 2];
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Intensidad del Picor',
        data: intensityData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: true,
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
        text: 'Evolución de la Intensidad del Picor',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Intensidad: ${context.raw}/10`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Intensidad (0-10)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default ItchIntensityChart;