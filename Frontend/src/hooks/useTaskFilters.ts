import { useContext } from "react";
import TaskFilterContext from "../context/TaskFilterContext";

// Custom hook to use the TaskFilterContext
export const useTaskFilters = () => {
  const context = useContext(TaskFilterContext);
  if (context === undefined) {
    throw new Error("useTaskFilters must be used within a TaskFilterProvider");
  }
  return context;
};