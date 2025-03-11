
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const itchingAreas = [
  "Cabeza", "Cuello", "Espalda", "Brazos", "Piernas", 
  "Manos", "Pies", "Generalizado"
];

const intensityQuestion = {
  question: "¿Cómo calificarías la intensidad de tu picor en las últimas 24 horas?",
  format: "Escala numérica de 0 a 10 (0 = Sin picor, 10 = El peor picor imaginable)"
};

const interferenceQuestion = {
  question: "¿El picor ha interferido con tu capacidad para concentrarte o realizar actividades diarias?",
  format: "Escala tipo Likert (Nada – Poco – Moderado – Mucho – Extremadamente)"
};

const frequencyQuestion = {
  question: "¿Cuántas veces al día experimentas episodios de picor?",
  format: "Opciones múltiples: (1-2 veces, 3-5 veces, más de 5 veces, constantemente)"
};

const durationQuestion = {
  question: "¿Cuánto dura un episodio de picor en promedio?",
  format: "Opciones múltiples: (Menos de 5 min, 5-15 min, 15-30 min, más de 30 min)"
};

const impactOnSleepQuestion = {
  question: "¿El picor ha afectado tu sueño en la última semana?",
  format: "Escala tipo Likert (Nunca – Ocasionalmente – A menudo – Siempre)"
};

const socialActivityQuestion = {
  question: "¿Has evitado actividades sociales debido al picor?",
  format: "Respuesta binaria (Sí / No)"
};

const emotionalImpactQuestion = {
  question: "¿Has evitado actividades sociales debido al picor?",
  format: "Respuesta binaria (Sí / No)"
};

const triggersQuestion = {
  question: "¿Cuándo suele empeorar tu picor?",
  format: "Opciones múltiples (Noche, Mañana, Después de una ducha, Con calor/frío, Sin patrón claro)"
};

const foodMedicationQuestion = {
  question: "¿Has notado que ciertos alimentos o medicamentos agravan tu picor?",
  format: "Respuesta abierta"
};

const treatmentQuestion = {
  question: "¿Has utilizado algún tratamiento para el picor en la última semana?",
  format: "Opciones múltiples (Antihistamínicos, Cremas, Medicación recetada, Otros, Ninguno)"
};

const treatmentEfficacyQuestion = {
  question: "¿Cuánto alivio te ha proporcionado tu tratamiento actual?",
  format: "Escala de 0 a 10 (0 = Ningún alivio, 10 = Alivio total)"
};

interface QuestionnaireData {
  id: string;
  date: string;
  intensity: number;
  interference: string;
  frequency: string;
  duration: string;
  selectedAreas: string[];
  sleepImpact: string;
  socialAvoidance: boolean;
  emotionalImpact: number;
  triggers: string[];
  foodMedicationTriggers: string;
  treatments: string[];
  treatmentEfficacy: number;
  imageCount: number;
  userId: string;
}

const QuestionnaireForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [intensity, setIntensity] = useState(0);
  const [interference, setInterference] = useState('Nada');
  const [frequency, setFrequency] = useState('1-2 veces');
  const [duration, setDuration] = useState('Menos de 5 min');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [sleepImpact, setSleepImpact] = useState('Nunca');
  const [socialAvoidance, setSocialAvoidance] = useState(false);
  const [emotionalImpact, setEmotionalImpact] = useState(1);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [foodMedicationTriggers, setFoodMedicationTriggers] = useState('');
  const [treatments, setTreatments] = useState<string[]>([]);
  const [treatmentEfficacy, setTreatmentEfficacy] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Check if user has already submitted today when component mounts
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
    }
  }, [user]);

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(
      selectedAreas.includes(area) 
        ? selectedAreas.filter(a => a !== area)
        : [...selectedAreas, area]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 3 images
      if (images.length + fileArray.length > 3) {
        toast({
          title: "Máximo 3 imágenes",
          description: "Por favor, selecciona un máximo de 3 imágenes.",
          variant: "destructive",
        });
        return;
      }
      
      setImages([...images, ...fileArray]);
      
      // Create preview URLs
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

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

    // Get existing questionnaires from localStorage
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires: QuestionnaireData[] = storedQuestionnaires 
      ? JSON.parse(storedQuestionnaires) 
      : [];

    // Check if user has already submitted a questionnaire today
    const today = new Date().setHours(0, 0, 0, 0);
    const hasSubmittedToday = questionnaires.some(q => {
      const submissionDate = new Date(q.date).setHours(0, 0, 0, 0);
      return q.userId === user.uid && submissionDate === today;
    });

    if (hasSubmittedToday) {
      toast({
        title: "Límite diario alcanzado",
        description: "Solo puedes enviar un cuestionario por día. Por favor, vuelve mañana.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new questionnaire data
    const newQuestionnaire: QuestionnaireData = {
      id: `q-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      intensity,
      interference,
      frequency,
      duration,
      selectedAreas,
      sleepImpact,
      socialAvoidance,
      emotionalImpact,
      triggers,
      foodMedicationTriggers,
      treatments,
      treatmentEfficacy,
      imageCount: images.length,
      userId: user.uid,
    };
    
    // Add new questionnaire and save to localStorage
    questionnaires.push(newQuestionnaire);
    localStorage.setItem('vitalytics-questionnaires', JSON.stringify(questionnaires));
    
    toast({
      title: "Cuestionario enviado",
      description: "Gracias por completar el cuestionario. Un profesional revisará tu información.",
    });
    
    // Reset form and go back to first page
    setCurrentPage(1);
    setIntensity(0);
    setInterference('Nada');
    setFrequency('1-2 veces');
    setDuration('Menos de 5 min');
    setSelectedAreas([]);
    setSleepImpact('Nunca');
    setSocialAvoidance(false);
    setEmotionalImpact(1);
    setTriggers([]);
    setFoodMedicationTriggers('');
    setTreatments([]);
    setTreatmentEfficacy(0);
    setImages([]);
    setPreviews([]);
    setHasSubmittedToday(true);
  };

  const validateCurrentPage = () => {
    switch(currentPage) {
      case 1:
        if (intensity === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, indica el nivel de intensidad del picor.",
            variant: "destructive",
          });
          return false;
        }
        if (!interference) {
          toast({
            title: "Campo requerido",
            description: "Por favor, indica el nivel de interferencia.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!frequency || !duration) {
          toast({
            title: "Campos requeridos",
            description: "Por favor, completa la frecuencia y duración del picor.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (selectedAreas.length === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, selecciona al menos una zona afectada.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4:
        if (!sleepImpact) {
          toast({
            title: "Campo requerido",
            description: "Por favor, indica el impacto en el sueño.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 5:
        if (triggers.length === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, selecciona al menos un factor desencadenante.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 6:
        if (treatments.length === 0) {
          toast({
            title: "Campo requerido",
            description: "Por favor, selecciona al menos un tratamiento utilizado.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

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

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">Página {currentPage} de {totalPages}</span>
        <span className="text-sm text-gray-600">{Math.round((currentPage / totalPages) * 100)}% completado</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-softGreen-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Intensidad y Severidad del Picor</h2>
            {/* Intensity Question */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{intensityQuestion.question}</h3>
              <div className="space-y-6">
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
                  {intensity === 0 ? "Sin picor" : `Nivel ${intensity}/10`}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Ubicación del Picor</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">¿Dónde sientes más picor? (Selecciona todas las que correspondan)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {itchingAreas.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`area-${area}`} 
                      checked={selectedAreas.includes(area)}
                      onCheckedChange={() => handleAreaToggle(area)}
                      className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                    />
                    <Label 
                      htmlFor={`area-${area}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Impacto en la Vida Diaria</h2>
            {/* Emotional Impact */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{emotionalImpactQuestion.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {["Nada", "Leve", "Moderado", "Severo", "Incapacitante"].map((level, index) => (
                  <div key={level} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`emotional-${index + 1}`}
                      name="emotional"
                      value={index + 1}
                      checked={emotionalImpact === index + 1}
                      onChange={(e) => setEmotionalImpact(Number(e.target.value))}
                      className="h-4 w-4 border-softGreen-400 text-softGreen-500 focus:ring-softGreen-500 focus:ring-offset-2 cursor-pointer"
                    />
                    <Label htmlFor={`emotional-${index + 1}`}>{level}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Factores Desencadenantes</h2>
            {/* Triggers */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{triggersQuestion.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Noche", "Mañana", "Después de una ducha", "Con calor/frío", "Sin patrón claro"].map((trigger) => (
                  <div key={trigger} className="flex items-center space-x-2">
                    <Checkbox
                      id={`trigger-${trigger}`}
                      checked={triggers.includes(trigger)}
                      onCheckedChange={() => {
                        setTriggers(
                          triggers.includes(trigger)
                            ? triggers.filter(t => t !== trigger)
                            : [...triggers, trigger]
                        );
                      }}
                      className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                    />
                    <Label htmlFor={`trigger-${trigger}`}>{trigger}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Food/Medication Triggers */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{foodMedicationQuestion.question}</h3>
              <textarea
                value={foodMedicationTriggers}
                onChange={(e) => setFoodMedicationTriggers(e.target.value)}
                className="w-full h-24 p-2 border rounded-md focus:ring-softGreen-500 focus:border-softGreen-500"
                placeholder="Describe aquí los alimentos o medicamentos que agravan tu picor..."
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Eficacia del Tratamiento</h2>
            {/* Treatments Used */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{treatmentQuestion.question}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Antihistamínicos", "Cremas", "Medicación recetada", "Otros", "Ninguno"].map((treatment) => (
                  <div key={treatment} className="flex items-center space-x-2">
                    <Checkbox
                      id={`treatment-${treatment}`}
                      checked={treatments.includes(treatment)}
                      onCheckedChange={() => {
                        setTreatments(
                          treatments.includes(treatment)
                            ? treatments.filter(t => t !== treatment)
                            : [...treatments, treatment]
                        );
                      }}
                      className="border-softGreen-400 data-[state=checked]:bg-softGreen-500 data-[state=checked]:border-softGreen-500"
                    />
                    <Label htmlFor={`treatment-${treatment}`}>{treatment}</Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Treatment Efficacy */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{treatmentEfficacyQuestion.question}</h3>
              <div className="space-y-6">
                <Slider
                  value={[treatmentEfficacy]}
                  onValueChange={([value]) => setTreatmentEfficacy(value)}
                  max={10}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sin alivio (0)</span>
                  <span>Alivio parcial (5)</span>
                  <span>Alivio total (10)</span>
                </div>
                <div className="text-center font-medium text-softGreen-700">
                  {treatmentEfficacy === 0 ? "Sin alivio" : `Nivel de alivio: ${treatmentEfficacy}/10`}
                </div>
              </div>
            </div>
            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adjunta fotos de las zonas afectadas (opcional)</h3>
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
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('photo-upload').click()}
                    disabled={images.length >= 3}
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Añadir foto
                  </Button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {images.length}/3 imágenes
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto glass-card p-6 rounded-xl"
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        if (currentPage === totalPages) {
          handleSubmit(e);
        }
      }} className="space-y-8">
        {renderProgressBar()}
        {hasSubmittedToday && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Ya has enviado un cuestionario hoy. Por favor, vuelve mañana para enviar otro.
            </p>
          </div>
        )}
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
            type={currentPage === totalPages ? 'submit' : 'button'}
            onClick={currentPage === totalPages ? undefined : handleNextPage}
            disabled={hasSubmittedToday}
          >
            {currentPage === totalPages ? 'Enviar' : 'Siguiente'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuestionnaireForm;
