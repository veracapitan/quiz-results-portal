import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Clock, FileText, BarChart3, PlayCircle, Star } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample data for questionnaires
const questionnaires = [
  {
    id: 1,
    title: "Conocimientos Generales",
    description: "Evalúa tu conocimiento en diversas áreas y temas de cultura general.",
    questions: 15,
    time: "10 minutos",
    icon: <FileText className="h-5 w-5" />,
    featured: true,
  },
  {
    id: 2,
    title: "Lógica y Razonamiento",
    description: "Pon a prueba tus habilidades de pensamiento lógico y resolución de problemas.",
    questions: 12,
    time: "15 minutos",
    icon: <BarChart3 className="h-5 w-5" />,
    featured: false,
  },
  {
    id: 3,
    title: "Ciencias",
    description: "Demuestra tus conocimientos en física, química y biología.",
    questions: 20,
    time: "20 minutos",
    icon: <Star className="h-5 w-5" />,
    featured: false,
  },
  {
    id: 4,
    title: "Historia Universal",
    description: "Preguntas sobre los eventos más importantes de la historia mundial.",
    questions: 18,
    time: "18 minutos",
    icon: <Bookmark className="h-5 w-5" />,
    featured: false,
  },
];

const Index = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.section 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 rounded-full bg-softGreen-100 text-softGreen-700 text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Cuestionarios Disponibles
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Pon a prueba tus conocimientos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecciona un cuestionario para comenzar. Puedes revisar tus resultados en cualquier momento.
          </p>
        </motion.section>

        {/* Featured Questionnaire */}
        {questionnaires.filter(q => q.featured).map((questionnaire) => (
          <motion.div
            key={questionnaire.id}
            className="relative overflow-hidden glass-card rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-softGreen-100 rounded-full -mr-16 -mt-16 opacity-70" />
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1 space-y-4 relative z-10">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-3">
                    {questionnaire.icon}
                  </div>
                  <span className="text-sm font-medium text-softGreen-700">Destacado</span>
                </div>
                
                <h2 className="text-2xl font-bold">{questionnaire.title}</h2>
                <p className="text-gray-600">{questionnaire.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{questionnaire.questions} preguntas</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{questionnaire.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <Button className="rounded-full bg-softGreen-500 hover:bg-softGreen-600 text-white shadow-lg shadow-softGreen-300/30 flex items-center gap-2 px-5 py-6">
                  <PlayCircle className="h-5 w-5" />
                  <span>Comenzar Cuestionario</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Other Questionnaires */}
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-6">Todos los Cuestionarios</h2>
          
          <motion.div 
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {questionnaires.filter(q => !q.featured).map((questionnaire) => (
              <motion.div
                key={questionnaire.id}
                className="hover-card glass-card rounded-xl overflow-hidden"
                variants={itemVariants}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center mr-2",
                      "bg-softGreen-100 text-softGreen-700",
                    )}>
                      {questionnaire.icon}
                    </div>
                    <h3 className="font-medium">{questionnaire.title}</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600">{questionnaire.description}</p>
                  
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      <span>{questionnaire.questions} preguntas</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{questionnaire.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-softGreen-100 bg-softGreen-50/50 p-3 flex justify-end">
                  <Button variant="ghost" className="text-softGreen-700 hover:text-softGreen-800 hover:bg-softGreen-100 text-sm">
                    Iniciar
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
