// Mock database service using localStorage
const query = async (text: string, params: any[] = []) => {
  console.log('Mock DB Query:', { text, params });
  
  // Esta es solo una implementación simulada
  // En una aplicación real, esto se conectaría a una API de backend
  return {
    rows: [],
    rowCount: 0
  };
};

const closePool = async () => {
  console.log('Mock DB connection closed');
};

export default {
  query,
  closePool,
};