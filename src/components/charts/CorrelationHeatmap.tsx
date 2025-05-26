import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  annotationPlugin
);

interface CorrelationHeatmapProps {
  patientId: string;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ patientId }) => {
  // Datos simulados para la matriz de correlación
  const correlationData = [
    { x: 1, y: 1, r: 20 }, // Estrés vs Intensidad del picor
    { x: 1, y: 2, r: 15 }, // Estrés vs Calidad del sueño
    { x: 1, y: 3, r: 10 }, // Estrés vs Eficacia del tratamiento
    { x: 1, y: 4, r: 5 },  // Estrés vs Temperatura ambiente
    
    { x: 2, y: 1, r: 12 }, // Alimentación vs Intensidad del picor
    { x: 2, y: 2, r: 8 },  // Alimentación vs Calidad del sueño
    { x: 2, y: 3, r: 6 },  // Alimentación vs Eficacia del tratamiento
    { x: 2, y: 4, r: 4 },  // Alimentación vs Temperatura ambiente
    
    { x: 3, y: 1, r: 18 }, // Actividad física vs Intensidad del picor
    { x: 3, y: 2, r: 14 }, // Actividad física vs Calidad del sueño
    { x: 3, y: 3, r: 9 },  // Actividad física vs Eficacia del tratamiento
    { x: 3, y: 4, r: 7 },  // Actividad física vs Temperatura ambiente
    
    { x: 4, y: 1, r: 16 }, // Humedad vs Intensidad del picor
    { x: 4, y: 2, r: 11 }, // Humedad vs Calidad del sueño
    { x: 4, y: 3, r: 8 },  // Humedad vs Eficacia del tratamiento
    { x: 4, y: 4, r: 13 }, // Humedad vs Temperatura ambiente
  ];
  
  const data = {
    datasets: [
      {
        label: 'Correlación',
        data: correlationData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Matriz de Correlación de Factores',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const xLabels = ['Estrés', 'Alimentación', 'Actividad física', 'Humedad'];
            const yLabels = ['Intensidad del picor', 'Calidad del sueño', 'Eficacia del tratamiento', 'Temperatura ambiente'];
            
            const xLabel = xLabels[context.raw.x - 1];
            const yLabel = yLabels[context.raw.y - 1];
            const strength = context.raw.r;
            
            return `${xLabel} vs ${yLabel}: Correlación ${strength}%`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: 0.5,
        max: 4.5,
        ticks: {
          callback: function(value: any) {
            const labels = ['Estrés', 'Alimentación', 'Actividad física', 'Humedad'];
            return labels[value - 1] || '';
          }
        }
      },
      y: {
        type: 'linear' as const,
        min: 0.5,
        max: 4.5,
        ticks: {
          callback: function(value: any) {
            const labels = ['Intensidad del picor', 'Calidad del sueño', 'Eficacia del tratamiento', 'Temperatura ambiente'];
            return labels[value - 1] || '';
          }
        }
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <Scatter data={data} options={options} />
      <div className="mt-2 text-sm text-gray-500 text-center">
        El tamaño de cada punto indica la fuerza de la correlación
      </div>
    </div>
  );
};

export default CorrelationHeatmap;


