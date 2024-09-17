import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Task } from "../models/Task";
import {
  getTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTaskById,
  markTaskAsDone,
  markTaskAsUndone,
  getAverageTime,
} from "../services/TaskService";

// Defining the shape of the context's value
interface TaskContextProps {
  tasks: Task[];
  fetchTasks: (
    page?: number,
    name?: string,
    priority?: number,
    done?: boolean
  ) => void;
  createTask: (task: Task) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  markTaskAsDone: (id: number) => Promise<void>;
  markTaskAsUndone: (id: number) => Promise<void>;
  averageTime: {
    totalTime: number;
    highTime: number;
    mediumTime: number;
    lowTime: number;
  };
  fetchAverageTime: () => void;
  updateAverageTime: () => void;
}

// Defining the shape of the TaskProvider's props
interface TaskProviderProps {
  children: ReactNode;
}

// Creating the context with an undefined initial value
const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Defining the TaskProvider component
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  // State to manage tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State to manage average time
  const [averageTime, setAverageTime] = useState<{
    totalTime: number;
    highTime: number;
    mediumTime: number;
    lowTime: number;
  }>({
    totalTime: 0,
    highTime: 0,
    mediumTime: 0,
    lowTime: 0,
  });

  // Function to fetch tasks from the server
  const fetchTasks = async (
    page: number = 1,
    name?: string,
    priority?: number,
    done?: boolean
  ): Promise<void> => {
    try {
      const response = await getTasks(
        undefined,
        undefined,
        page,
        done,
        name,
        priority
      );
      setTasks(response.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  // Function to fetch average time from the server
  const fetchAverageTime = async (): Promise<void> => {
    try {
      const data = await getAverageTime();
      setAverageTime(data);
    } catch (error) {
      console.error("Error fetching average time:", error);
    }
  };

  // Function to update average time
  const updateAverageTime = (): void => {
    fetchAverageTime();
  };

  // Helper function to update state after performing an action
  const updateState = async (
    updateFunction: () => Promise<any>
  ): Promise<void> => {
    await updateFunction();
    fetchTasks();
    updateAverageTime();
  };

  // Function to create a new task
  const createTask = async (task: Task): Promise<void> =>
    updateState(() => createTaskService(task));
  // Function to update an existing task
  const updateTask = async (id: number, task: Partial<Task>): Promise<void> =>
    updateState(() => updateTaskService(id, task));
  // Function to delete a task by ID
  const deleteTask = async (id: number): Promise<void> =>
    updateState(() => deleteTaskById(id));
  // Function to mark a task as done
  const markTaskAsDone = async (id: number): Promise<void> =>
    updateState(() => markTaskAsDone(id));
  // Function to mark a task as undone
  const markTaskAsUndone = async (id: number): Promise<void> =>
    updateState(() => markTaskAsUndone(id));

  // Fetch tasks and average time when the component mounts
  useEffect(() => {
    fetchTasks();
    fetchAverageTime();
  }, []);

  return (
    // Providing the context value to all child components
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        markTaskAsDone,
        markTaskAsUndone,
        averageTime,
        fetchAverageTime,
        updateAverageTime,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the TaskContext
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
