import React from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Cuestionarios = () => {
  const { user } = useAuth();

  // Redirect doctors to their dedicated results page
  if (user?.role === 'doctor') {
    return <Navigate to="/doctor-results" />;
  }

  return (
    <Layout>
      <div className="space-y-8">
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
            Nuevo Cuestionario
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Cuestionario de Evaluación de Picor</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete el siguiente cuestionario para ayudarnos a evaluar su condición actual.
            Sus respuestas serán revisadas por un profesional médico.
          </p>
        </motion.section>

        <QuestionnaireForm />
      </div>
    </Layout>
  );
};

export default Cuestionarios; 