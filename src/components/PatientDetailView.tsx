import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Thermometer, Droplets } from 'lucide-react';
import { Line, Bar, Radar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
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
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PatientDetailViewProps {
  patient: any;
  onClose: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Datos simulados para los gráficos
  const humidityData = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    datasets: [
      {
        label: 'Humedad Ambiental (%)',
        data: [65, 68, 62, 70, 63],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const temperatureData = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [24, 25, 23, 24, 22],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const itchIntensityData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
    datasets: [
      {
        label: 'Intensidad del Picor',
        data: [8, 7, 6, 7, 5, 4],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const sleepQualityData = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Semana 6'],
    datasets: [
      {
        label: 'Calidad del Sueño',
        data: [4, 5, 6, 5, 7, 8],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const affectedAreasData = {
    labels: ['Brazos', 'Piernas', 'Espalda', 'Pecho', 'Cuello', 'Cara'],
    datasets: [
      {
        label: 'Frecuencia de Afectación',
        data: [80, 65, 45, 30, 25, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
      },
    ],
  };

  const treatmentEfficacyData = {
    labels: ['Corticosteroides', 'Antihistamínicos', 'Emolientes', 'Fototerapia', 'Inmunosupresores'],
    datasets: [
      {
        label: 'Eficacia del Tratamiento',
        data: [7, 6, 8, 5, 4],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };

  const radarData = {
    labels: ['Picor', 'Enrojecimiento', 'Sequedad', 'Inflamación', 'Descamación', 'Dolor'],
    datasets: [
      {
        label: 'Actual',
        data: [4, 3, 5, 2, 4, 1],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
      },
      {
        label: 'Hace 3 meses',
        data: [7, 6, 8, 5, 7, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const triggerFactorsData = {
    labels: ['Estrés', 'Alimentación', 'Clima', 'Alérgenos', 'Productos', 'Ropa'],
    datasets: [
      {
        label: 'Impacto en Síntomas',
        data: [85, 60, 75, 90, 50, 40],
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };

  // Datos para el historial clínico
  const skinDiseaseHistory = [
    'Dermatitis Atópica (diagnosticada en 2015)',
    'Eccema de Contacto (episodios ocasionales desde 2018)',
    'Xerosis Cutánea (condición crónica)'
  ];

  const previousTreatments = [
    'Corticosteroides tópicos de potencia media (2015-2018)',
    'Tacrolimus tópico (2018-2020)',
    'Fototerapia UVB (10 sesiones en 2019)',
    'Antihistamínicos orales (uso intermitente)'
  ];

  const currentMedication = [
    'Betametasona 0.05% crema (aplicación diaria en zonas afectadas)',
    'Cetirizina 10mg (1 comprimido por la noche)',
    'Emolientes (Cetaphil, 3 veces al día)'
  ];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Análisis Detallado del Paciente</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="environmental">Factores Ambientales</TabsTrigger>
            <TabsTrigger value="clinical">Historial Clínico</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
            <TabsTrigger value="questionnaires">Cuestionarios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Funcionalidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Estamos trabajando en nuevas herramientas para ayudarte a gestionar mejor tu salud. ¡Vuelve pronto para ver las novedades!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Paciente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Nombre:</span>
                      <span>{patient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ID:</span>
                      <span>{patient.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Condición:</span>
                      <span>{patient.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Última actualización:</span>
                      <span>{patient.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Severidad:</span>
                      <span className={`font-semibold ${
                        patient.severity >= 70 ? 'text-red-500' : 
                        patient.severity >= 40 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {patient.severity}% ({
                          patient.severity >= 70 ? 'Alta' : 
                          patient.severity >= 40 ? 'Media' : 
                          'Baja'
                        })
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolución de la Intensidad del Picor</CardTitle>
                  <CardDescription>Últimos 6 semanas</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <Line 
                    data={itchIntensityData} 
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          min: 0,
                          max: 10,
                          title: {
                            display: true,
                            text: 'Intensidad (0-10)'
                          }
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calidad del Sueño</CardTitle>
                  <CardDescription>Últimos 6 semanas</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <Line 
                    data={sleepQualityData} 
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          min: 0,
                          max: 10,
                          title: {
                            display: true,
                            text: 'Calidad (0-10)'
                          }
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comparativa de Síntomas</CardTitle>
                <CardDescription>Actual vs. Hace 3 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Radar 
                  data={radarData} 
                  options={{
                    responsive: true,
                    scales: {
                      r: {
                        min: 0,
                        max: 10,
                        ticks: {
                          stepSize: 2
                        }
                      }
                    }
                  }} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Temperatura Ambiente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <Thermometer className="h-8 w-8 text-red-500 mr-2" />
                    <span className="text-3xl font-bold">24°C</span>
                  </div>
                  <Line 
                    data={temperatureData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Humedad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <Droplets className="h-8 w-8 text-blue-500 mr-2" />
                    <span className="text-3xl font-bold">65%</span>
                  </div>
                  <Line 
                    data={humidityData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          display: false
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Factores Desencadenantes</CardTitle>
                <CardDescription>Impacto en los síntomas</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Bar 
                  data={triggerFactorsData} 
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        min: 0,
                        max: 100,
                        title: {
                          display: true,
                          text: 'Impacto (%)'
                        }
                      }
                    }
                  }} 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Correlación Ambiental</CardTitle>
                <CardDescription>Relación entre factores ambientales y síntomas</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Temperatura vs. Intensidad</h3>
                    <div className="w-full h-48">
                      <Line 
                        data={{
                          labels: ['18°C', '20°C', '22°C', '24°C', '26°C', '28°C'],
                          datasets: [{
                            label: 'Intensidad del Picor',
                            data: [3, 4, 5, 7, 8, 9],
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                          }]
                        }} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }} 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-medium mb-2">Humedad vs. Intensidad</h3>
                    <div className="w-full h-48">
                      <Line 
                        data={{
                          labels: ['30%', '40%', '50%', '60%', '70%', '80%'],
                          datasets: [{
                            label: 'Intensidad del Picor',
                            data: [8, 7, 5, 4, 3, 4],
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                          }]
                        }} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              display: false
                            }
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial Clínico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Historial de Enfermedades de la Piel</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {skinDiseaseHistory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tratamientos Previos</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {previousTreatments.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Medicación Actual</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentMedication.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Respuesta al Tratamiento</h3>
                    <p>El paciente ha mostrado una respuesta moderada a los corticosteroides tópicos, con mejora significativa en las áreas tratadas. Los antihistamínicos han sido efectivos para controlar el prurito nocturno, mejorando la calidad del sueño. Se recomienda continuar con el régimen actual y reevaluar en 4 semanas.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Áreas Afectadas</CardTitle>
                  <CardDescription>Frecuencia de afectación por zona</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Doughnut 
                    data={affectedAreasData} 
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Eficacia de Tratamientos</CardTitle>
                  <CardDescription>Valoración de 0 a 10</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Bar 
                    data={treatmentEfficacyData} 
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          min: 0,
                          max: 10,
                          title: {
                            display: true,
                            text: 'Eficacia (0-10)'
                          }
                        }
                      }
                    }} 
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Síntomas</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <Line 
                  data={{
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                    datasets: [
                      {
                        label: 'Intensidad del Picor',
                        data: [8, 7, 8, 6, 5, 4],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        yAxisID: 'y',
                      },
                      {
                        label: 'Calidad del Sueño',
                        data: [4, 5, 4, 6, 7, 8],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        yAxisID: 'y',
                      },
                      {
                        label: 'Estrés',
                        data: [7, 8, 7, 6, 5, 4],
                        borderColor: 'rgb(255, 159, 64)',
                        backgroundColor: 'rgba(255, 159, 64, 0.5)',
                        yAxisID: 'y',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        min: 0,
                        max: 10,
                        title: {
                          display: true,
                          text: 'Escala (0-10)'
                        }
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frecuencia de Brotes</CardTitle>
                  <CardDescription>Por mes</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <Bar 
                    data={{
                      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                      datasets: [{
                        label: 'Número de Brotes',
                        data: [5, 4, 6, 3, 2, 1],
                        backgroundColor: 'rgba(153, 102, 255, 0.7)',
                      }]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Número de Brotes'
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Duración de Brotes</CardTitle>
                  <CardDescription>Promedio de días por mes</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <Bar 
                    data={{
                      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
                      datasets: [{
                        label: 'Días Promedio',
                        data: [7, 6, 8, 5, 4, 3],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                      }]
                    }}
                    options={{
                      responsive: true,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Días'
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cuestionarios</CardTitle>
                <CardDescription>Respuestas del paciente a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Cuestionarios Completados</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntuación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/06/2023</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Evaluación Semanal</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7/10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/06/2023</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Evaluación Semanal</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6/10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">01/06/2023</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Evaluación Semanal</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5/10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/05/2023</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Evaluación Mensual</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8/10</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Evolución de Respuestas</h3>
                    <div className="h-72">
                      <Line
                        data={{
                          labels: ['15/03', '01/04', '15/04', '01/05', '15/05', '01/06', '08/06', '15/06'],
                          datasets: [
                            {
                              label: 'Intensidad del Picor',
                              data: [8, 7, 7, 6, 8, 5, 6, 7],
                              borderColor: 'rgb(255, 99, 132)',
                              backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            },
                            {
                              label: 'Calidad del Sueño',
                              data: [4, 5, 5, 6, 4, 7, 6, 5],
                              borderColor: 'rgb(54, 162, 235)',
                              backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            },
                            {
                              label: 'Estrés Percibido',
                              data: [7, 6, 6, 5, 7, 4, 5, 6],
                              borderColor: 'rgb(255, 159, 64)',
                              backgroundColor: 'rgba(255, 159, 64, 0.5)',
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              min: 0,
                              max: 10
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Próximos Cuestionarios</h3>
                    <div className="bg-yellow-50 p-4 rounded-md">
                      <p className="text-yellow-700">Evaluación Semanal programada para el 22/06/2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailView;