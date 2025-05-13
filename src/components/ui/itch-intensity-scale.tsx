import * as React from "react";
import { cn } from "@/lib/utils";

interface ItchIntensityScaleProps {
  value: number;
  className?: string;
}

const ItchIntensityScale: React.FC<ItchIntensityScaleProps> = ({ value, className }) => {
  // Ensure value is between 0 and 10
  const normalizedValue = Math.min(10, Math.max(0, value));

  // Calculate color based on intensity
  const getColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-500";
    if (intensity <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Generate scale markers
  const markers = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor(normalizedValue)} transition-all duration-300`}
            style={{ width: `${(normalizedValue / 10) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between px-1">
        {markers.map((marker) => (
          <div
            key={marker}
            className={cn(
              "flex flex-col items-center",
              marker === normalizedValue && "font-bold text-primary"
            )}
          >
            <span className="text-xs">{marker}</span>
            {marker === normalizedValue && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Leve</span>
        <span>Moderado</span>
        <span>Severo</span>
      </div>
    </div>
  );
};

export { ItchIntensityScale };