import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface QuestionnaireData {
  id: string;
  date: string;
  intensity: number;
  selectedAreas: string[];
  activitiesImpact: {
    leisureSocial: string;
    houseworkErrands: string;
    workSchool: string;
  };
  triggers: string[];
  treatmentEfficacy: number;
  imageCount: number;
  userId: string;
}

const itchingAreas = [
  "Cabeza/Cuero cabelludo",
  "Cara",
  "Pecho",
  "Abdomen",
  "Espalda",
  "Glúteos",
  "Muslos",
  "Piernas inferiores",
  "Parte superior de los pies/dedos de los pies",
  "Plantas de los pies",
  "Palmas de las manos",
  "Parte superior de las manos/dedos",
  "Antebrazos",
  "Brazos superiores",
  "Puntos de contacto con la ropa (por ejemplo, cintura, ropa interior)",
  "Ingles"
];

// Opciones para la tabla de actividades
const activityScale = [
  { value: 'N/A', label: 'N/A' },
  { value: '1',  label: 'Nunca (1)' },
  { value: '2',  label: 'Raramente (2)' },
  { value: '3',  label: 'Ocasionalmente (3)' },
  { value: '4',  label: 'Frecuentemente (4)' },
  { value: '5',  label: 'Siempre (5)' },
];

// Filas de la tabla de actividades
const activities = [
  { key: 'leisureSocial',    label: 'Ocio/Social' },
  { key: 'houseworkErrands', label: 'Tareas domésticas/Recados' },
  { key: 'workSchool',       label: 'Trabajo/Escuela' },
];

// Opciones para los factores desencadenantes
const possibleTriggers = [
  "Noche",
  "Mañana",
  "Tarde",
  "Después de una ducha",
  "Sin patrón claro",
];

const QuestionnaireForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  // Aumentamos a 6 páginas para cubrir todas las preguntas + fotos
  const totalPages = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Estados para cada pregunta
  const [intensity, setIntensity] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [activitiesImpact, setActivitiesImpact] = useState({
    leisureSocial: '',
    houseworkErrands: '',
    workSchool: ''
  });
  const [triggers, setTriggers] = useState<string[]>([]);
  const [treatmentEfficacy, setTreatmentEfficacy] = useState(0);

  // Estados para manejar imágenes
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Para saber si el usuario ya envió cuestionario hoy
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Revisar en localStorage si el usuario ya envió un cuestionario hoy
  useEffect(() => {
    if (user) {
      const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
      const questionnaires: QuestionnaireData[] = storedQuestionnaires 
        ? JSON.parse(storedQuestionnaires) 
        : [];

      const today = new Date().setHours(0, 0, 0, 0);
      const submitted = questionnaires.some(q => {
        const submissionDate = new Date(q.date).setHours(0, 0, 0, 0);
        return q.userId === user.uid && submissionDate === today;
      });

      setHasSubmittedToday(submitted);

      // Reset form if user has already submitted today
      if (submitted) {
        setCurrentPage(1);
        setIntensity(0);
        setSelectedAreas([]);
        setActivitiesImpact({
          leisureSocial: '',
          houseworkErrands: '',
          workSchool: ''
        });
        setTriggers([]);
        setTreatmentEfficacy(0);
        setImages([]);
        setPreviews([]);
      }
    }
  }, [user]);

  // Manejo de selección de zonas de picor
  const handleAreaToggle = (area: string) => {
    setSelectedAreas(
      selectedAreas.includes(area)
        ? selectedAreas.filter(a => a !== area)
        : [...selectedAreas, area]
    );
  };

  // Manejo de selección en la tabla de actividades
  const handleActivityChange = (activityKey: string, value: string) => {
    setActivitiesImpact(prev => ({
      ...prev,
      [activityKey]: value,
    }));
  };

  // Manejo de selección de factores desencadenantes
  const handleTriggerToggle = (trigger: string) => {
    setTriggers(
      triggers.includes(trigger)
        ? triggers.filter(t => t !== trigger)
        : [...triggers, trigger]
    );
  };

  // Manejo de subida de imágenes (máx 3)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limitar a 3 imágenes
      if (images.length + fileArray.length > 3) {
        toast({
          title: "Máximo 3 imágenes",
          description: "Por favor, selecciona un máximo de 3 imágenes.",
          variant: "destructive",
        });
        return;
      }
      
      setImages([...images, ...fileArray]);
      
      // Crear URLs de previsualización
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  // Quitar una imagen de la lista
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // Validación de cada página antes de avanzar
  const validateCurrentPage = () => {

    switch (currentPage) {
      case 1: {
        // Intensidad puede ser 0 = "Sin picor", así que no lo forzamos a ser > 0.
        // Pero si quieres forzar al usuario a mover el slider, podrías hacerlo:
        // if (intensity === 0) { ... }
        return true;
      }
      case 2: {
        if (selectedAreas.length === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, selecciona al menos una zona de picor.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      }
      case 3: {
        // Verificamos que cada actividad tenga una respuesta
        const { leisureSocial, houseworkErrands, workSchool } = activitiesImpact;
        if (!leisureSocial || !houseworkErrands || !workSchool) {
          toast({
            title: "Campo requerido",
            description: "Responde para cada actividad cómo te afecta el picor.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      }
      case 4: {
        if (triggers.length === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, selecciona al menos un factor desencadenante.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      }
      case 5: {
        // treatmentEfficacy puede ser 0 (sin alivio) hasta 10.
        // No lo forzamos a un mínimo, ya que 0 es válido.
        return true;
      }
      case 6: {
        // Subir imágenes es opcional, así que no validamos nada.
        return true;
      }
      default:
        return true;
    }
  };

  // Manejo de botones Siguiente/Anterior
  const handleNextPage = () => {
    if (validateCurrentPage() && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Envío final del cuestionario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error al enviar",
        description: "Debes iniciar sesión para enviar el cuestionario.",
        variant: "destructive",
      });
      return;
    }

    // Create the questionnaire object with responses
    const newQuestionnaire: QuestionnaireData = {
      id: `q-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      intensity,
      selectedAreas,
      activitiesImpact,
      triggers,
      treatmentEfficacy,
      imageCount: images.length,
      userId: user.uid,
    };

    // Get stored questionnaires
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires: QuestionnaireData[] = storedQuestionnaires 
      ? JSON.parse(storedQuestionnaires) 
      : [];

    // Save to localStorage
    questionnaires.push(newQuestionnaire);
    localStorage.setItem('vitalytics-questionnaires', JSON.stringify(questionnaires));
    
    toast({
      title: "Cuestionario enviado",
      description: "Gracias por completar el cuestionario.",
    });
    
    // Reiniciar el formulario
    setCurrentPage(1);
    setIntensity(0);
    setSelectedAreas([]);
    setActivitiesImpact({
      leisureSocial: '',
      houseworkErrands: '',
      workSchool: ''
    });
    setTriggers([]);
    setTreatmentEfficacy(0);
    setImages([]);
    setPreviews([]);
    setHasSubmittedToday(true);
  };

  // Barra de progreso
  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <span className="text-sm text-gray-600">
          {Math.round((currentPage / totalPages) * 100)}% completado
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-softGreen-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );

  // Renderizado condicional de cada página
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1: // Intensidad del picor
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Cómo calificarías la intensidad de tu picor en las últimas 24 horas?
            </h2>
            <p className="text-sm text-gray-600">
              Escala de 0 a 10 (0 = Sin picor, 10 = El peor picor imaginable)
            </p>
            <div className="space-y-4">
              <Slider
                value={[intensity]}
                onValueChange={([value]) => setIntensity(value)}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sin picor (0)</span>
                <span>Moderado (5)</span>
                <span>Máximo (10)</span>
              </div>
              <div className="text-center font-medium text-softGreen-700">
                {`Nivel: ${intensity}/10`}
              </div>
            </div>
          </div>
        );
      case 2: // Dónde sientes más picor
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Dónde sientes más picor? (Selecciona todas las que correspondan)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {itchingAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`area-${area}`}
                    checked={selectedAreas.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area)}
                    className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                  />
                  <Label htmlFor={`area-${area}`} className="text-sm font-medium cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3: // Actividades y grado de afectación
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿En qué medida el picor afecta las siguientes actividades?
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b border-gray-200"></th>
                    {activityScale.map((scale) => (
                      <th key={scale.value} className="p-2 text-center border-b border-gray-200 text-xs sm:text-sm">
                        {scale.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.key} className="text-sm">
                      <td className="p-2 border-b border-gray-200 font-medium">
                        {activity.label}
                      </td>
                      {activityScale.map((scale) => (
                        <td key={scale.value} className="p-2 border-b border-gray-200 text-center">
                          <input
                            type="radio"
                            name={activity.key}
                            value={scale.value}
                            checked={activitiesImpact[activity.key] === scale.value}
                            onChange={() => handleActivityChange(activity.key, scale.value)}
                            className="cursor-pointer h-4 w-4 border-softGreen-400 text-softGreen-500 focus:ring-softGreen-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 4: // Cuándo empeora el picor
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Cuándo suele empeorar tu picor?
            </h2>
            <p className="text-sm text-gray-600">
              Selecciona todas las opciones que apliquen.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {possibleTriggers.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-2">
                  <Checkbox
                    id={`trigger-${trigger}`}
                    checked={triggers.includes(trigger)}
                    onCheckedChange={() => handleTriggerToggle(trigger)}
                    className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                  />
                  <Label htmlFor={`trigger-${trigger}`} className="cursor-pointer">
                    {trigger}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );
      case 5: // Eficacia del tratamiento
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              ¿Cuánto alivio te ha proporcionado tu tratamiento actual?
            </h2>
            <p className="text-sm text-gray-600">
              Escala de 0 a 10 (0 = Ningún alivio, 10 = Alivio total)
            </p>
            <div className="space-y-4">
              <Slider
                value={[treatmentEfficacy]}
                onValueChange={([value]) => setTreatmentEfficacy(value)}
                max={10}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sin alivio (0)</span>
                <span>Alivio moderado (5)</span>
                <span>Alivio total (10)</span>
              </div>
              <div className="text-center font-medium text-softGreen-700">
                {`Nivel de alivio: ${treatmentEfficacy}/10`}
              </div>
            </div>
          </div>
        );
      case 6: // Subir hasta 3 fotos
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Adjunta fotos de las zonas afectadas (opcional)
            </h2>
            <p className="text-sm text-gray-600">
              Puedes subir hasta 3 imágenes.
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Imagen ${index + 1}`}
                      className="h-24 w-24 object-cover rounded-lg border border-softGreen-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={images.length >= 3}
                >
                  Subir imagen
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {images.length}/3 imágenes
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto glass-card p-6 rounded-xl"
    >
      {hasSubmittedToday ? (
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">Cuestionario ya enviado</h3>
            <p className="text-yellow-700">
              Ya has completado el cuestionario de hoy. Por favor, vuelve mañana para realizar un nuevo seguimiento.
            </p>
          </div>
          <p className="text-gray-600">
            Gracias por tu participación en el seguimiento diario de tu condición.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentPage === totalPages) {
              handleSubmit(e);
            }
          }}
          className="space-y-8"
        >
          {renderProgressBar()}
          {renderCurrentPage()}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              type="button"
              onClick={currentPage === totalPages ? handleSubmit : handleNextPage}
            >
              {currentPage === totalPages ? 'Enviar' : 'Siguiente'}
            </Button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default QuestionnaireForm;
