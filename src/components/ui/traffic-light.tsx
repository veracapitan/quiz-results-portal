import React from 'react';

interface TrafficLightProps {
  intensity: number;
}

const TrafficLight: React.FC<TrafficLightProps> = ({ intensity }) => {
  const getColor = () => {
    if (intensity <= 3) return 'green';
    if (intensity <= 6) return 'orange';
    return 'red';
  };

  return (
    <div style={{ width: '50px', height: '150px', backgroundColor: getColor(), borderRadius: '10px' }}>
      <div style={{ width: '100%', height: '33%', backgroundColor: intensity <= 3 ? 'green' : 'gray' }}></div>
      <div style={{ width: '100%', height: '33%', backgroundColor: intensity > 3 && intensity <= 6 ? 'orange' : 'gray' }}></div>
      <div style={{ width: '100%', height: '33%', backgroundColor: intensity > 6 ? 'red' : 'gray' }}></div>
    </div>
  );
};

export default TrafficLight;