
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const itchingAreas = [
  "Cabeza", "Cara", "Cuello", "Brazos", "Manos", 
  "Pecho", "Espalda", "Abdomen", "Piernas", "Pies"
];

const QuestionnaireForm = () => {
  const { toast } = useToast();
  const [itchLevel, setItchLevel] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

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
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    toast({
      title: "Cuestionario enviado",
      description: "Gracias por completar el cuestionario. Un profesional revisará tu información.",
    });
    
    // Reset form
    setItchLevel(0);
    setSelectedAreas([]);
    setImages([]);
    setPreviews([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto glass-card p-6 rounded-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Itching Level Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">¿Qué nivel de picor sientes?</h3>
          <div className="space-y-6">
            <Slider 
              value={[itchLevel]} 
              onValueChange={([value]) => setItchLevel(value)} 
              max={10} 
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Leve (1)</span>
              <span>Moderado (5)</span>
              <span>Intenso (10)</span>
            </div>
            <div className="text-center font-medium text-softGreen-700">
              {itchLevel === 0 ? "Sin picor" : `Nivel ${itchLevel}/10`}
            </div>
          </div>
        </div>

        {/* Itching Areas Question */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">¿Qué zonas te pican?</h3>
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
              
              {previews.length < 3 && (
                <label className={cn(
                  "h-24 w-24 flex flex-col items-center justify-center rounded-lg",
                  "border-2 border-dashed border-softGreen-300 bg-softGreen-50",
                  "cursor-pointer hover:bg-softGreen-100 transition-colors"
                )}>
                  <Paperclip className="h-6 w-6 text-softGreen-500 mb-1" />
                  <span className="text-xs text-softGreen-700">Añadir foto</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500">Puedes subir hasta 3 imágenes. Formatos: JPG, PNG</p>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-softGreen-500 hover:bg-softGreen-600 py-6 text-white"
        >
          <Send className="h-5 w-5 mr-2" />
          Enviar cuestionario
        </Button>
      </form>
    </motion.div>
  );
};

export default QuestionnaireForm;
