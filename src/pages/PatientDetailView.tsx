import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText, Activity, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importar los componentes de gráficos
import ItchIntensityChart from '@/components/charts/ItchIntensityChart';
import AffectedAreasChart from '@/components/charts/AffectedAreasChart';
import TriggerFactorsChart from '@/components/charts/TriggerFactorsChart';
import TreatmentEfficacyChart from '@/components/charts/TreatmentEfficacyChart';
import CorrelationHeatmap from '@/components/charts/CorrelationHeatmap';
import PhysiologicalDataCard from '@/components/PhysiologicalDataCard';
import SleepDataCard from '@/components/SleepDataCard';
import ChatComponent from '@/components/ChatComponent';
import ResultsComponent from '@/components/ResultsComponent';
import AppointmentsComponent from '@/components/AppointmentsComponent';

// Datos simulados del paciente
const mockPatientData = {
  id: 'patient-123',
  name: 'Ana García',
  age: 34,
  gender: 'Femenino',
  diagnosis: 'Dermatitis Atópica',
  treatmentEfficacy: 6,
  lastUpdate: '15 de marzo de 2023',
  notes: 'Paciente con dermatitis atópica moderada. Presenta exacerbaciones periódicas relacionadas con el estrés y cambios estacionales. Actualmente en tratamiento con corticosteroides tópicos y emolientes.'
};

const PatientDetailView: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(mockPatientData);
  
  // Simulamos la carga de datos del paciente
  useEffect(() => {
    // En una aplicación real, aquí cargaríamos los datos del paciente desde la API
    console.log(`Cargando datos del paciente ${patientId}`);
    // Por ahora usamos datos simulados
    setPatient({
      ...mockPatientData,
      id: patientId || 'unknown'
    });
  }, [patientId]);
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/doctor-results')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <p className="text-gray-500">
            {patient.age} años • {patient.gender} • {patient.diagnosis}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Última Actualización</CardTitle>
            <CardDescription>Datos del cuestionario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              <span>{patient.lastUpdate}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Eficacia del Tratamiento</CardTitle>
            <CardDescription>Evaluación del paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-500" />
              <span>{patient.treatmentEfficacy}/10</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Notas Clínicas</CardTitle>
            <CardDescription>Observaciones médicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-500" />
              <span className="text-sm">{patient.notes.substring(0, 50)}...</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="physiological">Datos Fisiológicos</TabsTrigger>
          <TabsTrigger value="correlations">Correlaciones</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TreatmentEfficacyChart 
              patientId={patient.id} 
              treatmentEfficacy={patient.treatmentEfficacy} 
            />
            <TriggerFactorsChart patientId={patient.id} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PhysiologicalDataCard patientId={patient.id} />
            <SleepDataCard patientId={patient.id} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Notas Clínicas Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.notes}</p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tratamientos Actuales:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Corticosteroides tópicos (Betametasona 0.05%) - Aplicación diaria</li>
                  <li>Emolientes (Cetaphil) - 3 veces al día</li>
                  <li>Antihistamínicos orales (Cetirizina 10mg) - Por la noche</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Recomendaciones:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Evitar duchas calientes y prolongadas</li>
                  <li>Usar ropa de algodón</li>
                  <li>Mantener la piel hidratada</li>
                  <li>Técnicas de manejo del estrés</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de la Intensidad del Picor</CardTitle>
              <CardDescription>Últimos 3 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ItchIntensityChart patientId={patient.id} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Áreas Afectadas</CardTitle>
              <CardDescription>Frecuencia de afectación por zona</CardDescription>
            </CardHeader>
            <CardContent>
              <AffectedAreasChart patientId={patient.id} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Eficacia del Tratamiento</CardTitle>
              <CardDescription>Evolución en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <TreatmentEfficacyChart 
                patientId={patient.id} 
                treatmentEfficacy={patient.treatmentEfficacy} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="physiological" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PhysiologicalDataCard patientId={patient.id} />
            <SleepDataCard patientId={patient.id} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Niveles de Estrés</CardTitle>
              <CardDescription>Medidos por variabilidad de frecuencia cardíaca</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Aquí iría un gráfico de niveles de estrés */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Gráfico de niveles de estrés</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actividad Física</CardTitle>
              <CardDescription>Pasos diarios y actividad</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Aquí iría un gráfico de actividad física */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Gráfico de actividad física</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="correlations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Correlación</CardTitle>
              <CardDescription>Relación entre factores y síntomas</CardDescription>
            </CardHeader>
            <CardContent>
              <CorrelationHeatmap patientId={patient.id} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Correlación Estrés-Picor</CardTitle>
                <CardDescription>Análisis de la relación</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Aquí iría un gráfico de correlación estrés-picor */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Gráfico de correlación estrés-picor</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Correlación Sueño-Síntomas</CardTitle>
                <CardDescription>Análisis de la relación</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {/* Aquí iría un gráfico de correlación sueño-síntomas */}
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Gráfico de correlación sueño-síntomas</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Análisis Predictivo</CardTitle>
              <CardDescription>Predicción de brotes basada en factores históricos</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* Aquí iría un gráfico de análisis predictivo */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Gráfico de análisis predictivo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Nuevas pestañas para mostrar todos los datos */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Médicos</CardTitle>
              <CardDescription>Historial de resultados del paciente</CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsComponent patientId={patient.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Citas Médicas</CardTitle>
              <CardDescription>Historial y programación de citas</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentsComponent patientId={patient.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comunicación con el Paciente</CardTitle>
              <CardDescription>Historial de mensajes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatComponent patientId={patient.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailView;