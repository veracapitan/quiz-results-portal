// Import any necessary dependencies
import { QuestionnaireData } from '../components/QuestionnaireForm';

// Mock db import - we'll only use localStorage for now
import db from '../lib/db';

/**
 * Saves a questionnaire to localStorage
 * @param questionnaire The questionnaire data to save
 * @returns Promise with success status and ID of saved questionnaire
 */
export const saveQuestionnaire = async (questionnaire: Omit<QuestionnaireData, 'id'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    // Generate a unique ID for the questionnaire
    const id = `q-${Date.now()}`;
    
    // Save to localStorage
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires: QuestionnaireData[] = storedQuestionnaires 
      ? JSON.parse(storedQuestionnaires) 
      : [];

    questionnaires.push({
      ...questionnaire,
      id
    });
    
    localStorage.setItem('vitalytics-questionnaires', JSON.stringify(questionnaires));
    
    return {
      success: true,
      id
    };
  } catch (error) {
    console.error('Error saving questionnaire:', error);
    return {
      success: false,
      error: 'Error al guardar cuestionario. Por favor, inténtalo de nuevo.'
    };
  }
};

export const getQuestionnairesByUserId = async (userId: string) => {
  try {
    // Get from localStorage
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    if (!storedQuestionnaires) {
      return {
        success: true,
        questionnaires: []
      };
    }
    
    const allQuestionnaires: QuestionnaireData[] = JSON.parse(storedQuestionnaires);
    const userQuestionnaires = allQuestionnaires
      .filter(q => q.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return {
      success: true,
      questionnaires: userQuestionnaires
    };
  } catch (error) {
    console.error('Error al obtener cuestionarios:', error);
    return {
      success: false,
      error: 'Error al obtener cuestionarios. Por favor, inténtalo de nuevo.',
    };
  }
};

/**
 * Checks if a user has submitted a questionnaire today
 * @param userId The user ID to check
 * @returns Promise with success status and whether user has submitted today
 */
export const hasSubmittedToday = async (userId: string): Promise<{ success: boolean; hasSubmitted: boolean; error?: string }> => {
  try {
    // Check in localStorage
    const storedQuestionnaires = localStorage.getItem('vitalytics-questionnaires');
    const questionnaires: QuestionnaireData[] = storedQuestionnaires 
      ? JSON.parse(storedQuestionnaires) 
      : [];

    const today = new Date().setHours(0, 0, 0, 0);
    const submitted = questionnaires.some(q => {
      const submissionDate = new Date(q.date).setHours(0, 0, 0, 0);
      return q.userId === userId && submissionDate === today;
    });

    return {
      success: true,
      hasSubmitted: submitted
    };
  } catch (error) {
    console.error('Error al verificar envío de cuestionario:', error);
    return {
      success: false,
      hasSubmitted: false,
      error: 'Error al verificar envío de cuestionario. Por favor, inténtalo de nuevo.',
    };
  }
};