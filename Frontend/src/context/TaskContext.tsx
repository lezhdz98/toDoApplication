import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { Task } from "../models/Task";
import {
  getTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTaskById,
  markTaskAsDone as markTaskAsDoneService,
  markTaskAsUndone as markTaskAsUndoneService,
} from "../services/TaskService";
import { usePagination } from "../hooks/usePagination";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useAverageTime } from "../hooks/useAverageTime";

// Define a type for the task input
export interface TaskInput {
  name: string;
  priority: 0 | 1 | 2;
  dueDate?: string;
}

// Define the shape of the context value
interface TaskContextProps {
  tasks: Task[];
  fetchTasks: () => void;
  createTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: number, task: TaskInput) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  markTaskAsDone: (id: number) => Promise<void>;
  markTaskAsUndone: (id: number) => Promise<void>;
}

// Create the context
const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentPage, setTotalPages } = usePagination();
  const { filters } = useTaskFilters();
  const { fetchAverageTime } = useAverageTime();
  const prevFiltersRef = useRef(filters); // Use ref to track previous filters
  const prevPageRef = useRef(currentPage); // Use ref to track previous page

  // Function to fetch tasks from the endpoint
  const fetchTasks = async (): Promise<void> => {
    try {
      // Ensure priority is a valid number or undefined
      const priority =
        filters.priority !== undefined && !isNaN(filters.priority)
          ? filters.priority
          : undefined;
      const done = filters.done !== undefined ? filters.done : undefined;
      console.log("Fetching tasks with filters:", filters);
      console.log("Current page:", currentPage);
      const response = await getTasks(
        filters.sortBy,
        currentPage,
        done,
        filters.name,
        priority
      );
      setTasks(response.tasks || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  // Function to create a new task
  const createTask = async (task: TaskInput): Promise<void> => {
    await createTaskService(task);
    fetchTasks();
  };

  // Function to update an existing task
  const updateTask = async (id: number, task: TaskInput): Promise<void> => {
    await updateTaskService(id, task);
    fetchTasks();
  };

  // Function to delete a task by its ID
  const deleteTask = async (id: number): Promise<void> => {
    await deleteTaskById(id);
    fetchTasks();
    fetchAverageTime();
  };

  // Function to mark a task as done
  const markTaskAsDone = async (id: number): Promise<void> => {
    await markTaskAsDoneService(id);
    fetchTasks();
    fetchAverageTime();
  };

  // Function to mark a task as undone
  const markTaskAsUndone = async (id: number): Promise<void> => {
    await markTaskAsUndoneService(id);
    fetchTasks();
    fetchAverageTime();
  };

  // Fetch tasks when the component mounts or when currentPage or filters change
  useEffect(() => {
    const prevFilters = prevFiltersRef.current;
    const prevPage = prevPageRef.current;

    // Check if filters have changed
    const filtersChanged =
      prevFilters.name !== filters.name ||
      prevFilters.priority !== filters.priority ||
      prevFilters.done !== filters.done ||
      prevFilters.sortBy !== filters.sortBy;

    if (filtersChanged || currentPage !== prevPage) {
      fetchTasks();
    }

    // Update the previous filters and page reference
    prevFiltersRef.current = filters;
    prevPageRef.current = currentPage;
  }, [currentPage, filters]);

  // Provide the context value to children
  return (
    <TaskContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        markTaskAsDone,
        markTaskAsUndone,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
