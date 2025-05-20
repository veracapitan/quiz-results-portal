import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

interface PatientChartProps {
  data: ChartData[];
  color?: string;
  title: string;
  yAxisLabel?: string;
}

const PatientChart: React.FC<PatientChartProps> = ({ 
  data, 
  color = '#10B981', 
  title,
  yAxisLabel
}) => {
  // Enhanced error handling and loading states
  if (!data) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500 animate-pulse">Cargando datos...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-center">No hay datos disponibles</p>
        <p className="text-gray-400 text-sm text-center mt-2">Los datos aparecerán aquí cuando estén disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center justify-between">
        {title}
        <span className="text-xs text-gray-400">
          Última actualización: {new Date().toLocaleDateString()}
        </span>
      </h4>
      <div className="w-full h-[200px] transition-all duration-300 ease-in-out hover:shadow-lg rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 15,
              left: 15,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 'auto']} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            {Object.keys(data[0]).filter(key => key !== 'name').map((dataKey, index) => (
              <Line
                key={dataKey}
                type="monotone"
                dataKey={dataKey}
                stroke={Array.isArray(color) ? color[index] : color}
                strokeWidth={2}
                dot={{ fill: Array.isArray(color) ? color[index] : color }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientChart;