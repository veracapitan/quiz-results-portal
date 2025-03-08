
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Layout from '@/components/Layout';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (searchTerm: string) => {
    navigate(`/resultados?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {user?.role === 'doctor' ? (
          <>
            <motion.section 
              className="text-center space-y-4 mb-8"
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
                Panel Médico
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Análisis de Pacientes</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Busque y analice los datos de sus pacientes para un mejor seguimiento de su condición.
              </p>
            </motion.section>

            <div className="max-w-2xl mx-auto glass-card p-6 rounded-xl">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Buscar Pacientes</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por ID, fecha o condición..."
                    className="pl-10"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Acceda a los resultados y análisis detallados de sus pacientes en la sección de Resultados.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <motion.section 
              className="text-center space-y-4 mb-8"
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
                Cuestionario Médico
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Cuestionario de Evaluación de Picor</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Por favor complete el siguiente cuestionario para ayudarnos a evaluar su condición.
                Sus respuestas serán revisadas por un profesional médico.
              </p>
            </motion.section>

            <QuestionnaireForm />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
