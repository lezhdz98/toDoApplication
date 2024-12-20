import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getAverageTime } from "../services/TaskService";

// Define the shape of the context value
interface AverageTimeContextProps {
  averageTime: {
    totalTime: number;
    highTime: number;
    mediumTime: number;
    lowTime: number;
  };
  fetchAverageTime: () => void;
}

// Create the context
const AverageTimeContext = createContext<AverageTimeContextProps | undefined>(
  undefined
);

// Provider component
export const AverageTimeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [averageTime, setAverageTime] = useState<{
    totalTime: number;
    highTime: number;
    mediumTime: number;
    lowTime: number;
  }>({ totalTime: 0, highTime: 0, mediumTime: 0, lowTime: 0 });

  // Function to fetch average time from the endpoint
  const fetchAverageTime = async (): Promise<void> => {
    try {
      const data = await getAverageTime();
      setAverageTime(data);
    } catch (error) {
      console.error("Error fetching average time:", error);
    }
  };

  // Fetch average time when the component mounts
  useEffect(() => {
    fetchAverageTime();
  }, []);

  // Provide the context value to children
  return (
    <AverageTimeContext.Provider value={{ averageTime, fetchAverageTime }}>
      {children}
    </AverageTimeContext.Provider>
  );
};

export default AverageTimeContext;
