import React, { useState, useEffect } from 'react';

interface Result {
  id: string;
  date: Date;
  type: string;
  description: string;
  fileUrl?: string;
}

interface ResultsComponentProps {
  patientId: string;
}

const ResultsComponent: React.FC<ResultsComponentProps> = ({ patientId }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí deberías cargar los resultados del paciente desde tu backend
    const fetchResults = async () => {
      try {
        // Ejemplo de datos (reemplazar con tu llamada API real)
        const mockResults: Result[] = [
          {
            id: '1',
            date: new Date('2024-03-15'),
            type: 'Análisis de Sangre',
            description: 'Hemograma completo',
            fileUrl: '/path/to/file.pdf'
          },
          // Agregar más resultados según sea necesario
        ];
        
        setResults(mockResults);
      } catch (error) {
        console.error('Error al cargar los resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [patientId]);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Mis Resultados</h2>
      
      {results.length === 0 ? (
        <p>No hay resultados disponibles.</p>
      ) : (
        <div className="grid gap-4">
          {results.map((result) => (
            <div key={result.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{result.type}</h3>
                  <p className="text-gray-600">{result.description}</p>
                  <p className="text-sm text-gray-500">
                    Fecha: {result.date.toLocaleDateString()}
                  </p>
                </div>
                {result.fileUrl && (
                  <a
                    href={result.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Ver documento
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsComponent; 