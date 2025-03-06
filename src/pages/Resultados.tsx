
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, BarChart, Calendar, Clock, Info, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Sample data for results
const results = [
  {
    id: 1,
    title: "Conocimientos Generales",
    date: "15 de mayo, 2023",
    score: 85,
    correct: 12,
    total: 15,
    time: "8 minutos",
    status: "completed",
  },
  {
    id: 2,
    title: "Lógica y Razonamiento",
    date: "10 de mayo, 2023",
    score: 75,
    correct: 9,
    total: 12,
    time: "12 minutos",
    status: "completed",
  },
  {
    id: 3,
    title: "Historia Universal",
    date: "1 de mayo, 2023",
    score: 60,
    correct: 10,
    total: 18,
    time: "15 minutos",
    status: "completed",
  },
];

// Function to determine color based on score
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

// Function to determine progress color based on score
const getProgressColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const Resultados = () => {
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
        {/* Header */}
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
            Análisis de Resultados
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mis Resultados</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revisa tu progreso y el desempeño en cada uno de los cuestionarios que has completado.
          </p>
        </motion.section>

        {/* Summary Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cuestionarios Completados</p>
              <p className="text-2xl font-bold">{results.length}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Puntuación Media</p>
              <p className="text-2xl font-bold">
                {Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-card rounded-xl p-5 flex items-center"
            variants={itemVariants}
          >
            <div className="h-12 w-12 rounded-full bg-softGreen-100 flex items-center justify-center text-softGreen-700 mr-4">
              <BarChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Respuestas Correctas</p>
              <p className="text-2xl font-bold">
                {results.reduce((acc, r) => acc + r.correct, 0)} / {results.reduce((acc, r) => acc + r.total, 0)}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Results List */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Historial de Resultados</h2>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((result) => (
              <motion.div
                key={result.id}
                className="glass-card rounded-xl overflow-hidden hover-card"
                variants={itemVariants}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{result.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{result.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{result.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className={cn("text-2xl font-bold", getScoreColor(result.score))}>
                        {result.score}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.correct} de {result.total} correctas
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Puntuación</span>
                      <span className="font-medium">{result.score}%</span>
                    </div>
                    <Progress value={result.score} className="h-2 bg-gray-100" indicatorClassName={getProgressColor(result.score)} />
                  </div>
                </div>
                
                <div className="border-t border-softGreen-100 bg-softGreen-50/50 p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-softGreen-700 mr-1" />
                    <span className="text-xs text-gray-500">Completado</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-softGreen-700 hover:text-softGreen-800 hover:bg-softGreen-100 text-sm flex items-center">
                    Ver Detalles
                    <ChevronRight className="h-4 w-4 ml-1" />
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

export default Resultados;
