import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context value
interface TaskFilterContextProps {
  filters: {
    name?: string;
    priority?: number;
    done?: boolean;
    sortBy?: string;
  };
  setFilters: (filters: {
    name?: string;
    priority?: number;
    done?: boolean;
    sortBy?: string;
  }) => void;
}

// Create the context
const TaskFilterContext = createContext<TaskFilterContextProps | undefined>(
  undefined
);

// Provider component
export const TaskFilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [filters, setFilters] = useState<{
    name?: string;
    priority?: number;
    done?: boolean;
    sortBy?: string;
  }>({
    name: "",
    priority: undefined,
    done: undefined,
    sortBy: "",
  });

  // Provide the context value to children
  return (
    <TaskFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </TaskFilterContext.Provider>
  );
};

export default TaskFilterContext;
