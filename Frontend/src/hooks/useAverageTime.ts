import { useContext } from "react";
import AverageTimeContext from "../context/AverageTimeContext";

// Custom hook to use the AverageTimeContext
export const useAverageTime = () => {
  const context = useContext(AverageTimeContext);
  if (context === undefined) {
    throw new Error("useAverageTime must be used within an AverageTimeProvider");
  }
  return context;
};