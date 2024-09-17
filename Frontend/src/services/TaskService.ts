import axiosInstance from '../api/axiosConfig';
import { Task } from '../models/Task';

// Validates that the priority is within the allowed range (0, 1, 2)
const validatePriority = (priority: number): boolean => {
  return [0, 1, 2].includes(priority);
};

// Converts the dates of a Task to ISO 8601 strings
const convertTaskDatesToISO = (task: { dueDate?: string | null }) => ({
  ...task,
  dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
});

// Fetches tasks from the server
export const getTasks = async (
  sortBy?: string[],
  sortOrder?: string[],
  page: number = 1,
  done?: boolean,
  name?: string,
  priority?: number
): Promise<{ tasks: Task[], currentPage: number, totalPages: number }> => {
  const params: any = { page, done, name, priority };

  if (sortBy && sortBy.length > 0) {
    params.sortBy = sortBy[0]; // Send the first value of sortBy as a string
  }

  if (sortOrder && sortOrder.length > 0) {
    params.sortOrder = sortOrder[0]; // Send the first value of sortOrder as a string
  }

  const response = await axiosInstance.get('/todos', { params });
  return response.data;
};

// Creates a new task
export const createTask = async (task: { name: string, priority: number, dueDate?: string | null }): Promise<Task> => {
  if (!validatePriority(task.priority)) {
    throw new Error('Priority must be 0, 1, or 2');
  }

  if (!task.name || task.name.trim() === '') {
    throw new Error('Task name cannot be null or empty');
  }

  const taskToSend = convertTaskDatesToISO(task);
  const response = await axiosInstance.post('/todos', taskToSend);
  return response.data;
};

// Updates an existing task
export const updateTask = async (id: number, task: Partial<Task>): Promise<{ message: string, id: string }> => {
  if (task.priority !== undefined && !validatePriority(task.priority)) {
    throw new Error('Priority must be 0, 1, or 2');
  }

  const taskToSend = convertTaskDatesToISO(task as Task);
  const response = await axiosInstance.put(`/todos/${id}`, taskToSend);
  return response.data;
};

// Deletes a task by its ID
export const deleteTaskById = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/todos/${id}/delete`);
};

// Marks a task as completed
export const markTaskAsDone = async (id: number): Promise<{ message: string, id: string }> => {
  const response = await axiosInstance.post(`/todos/${id}/done`);
  return response.data;
};

// Marks a task as not completed
export const markTaskAsUndone = async (id: number): Promise<{ message: string, id: string }> => {
  const response = await axiosInstance.put(`/todos/${id}/undone`);
  return response.data;
};

// Fetches the average time to complete tasks
export const getAverageTime = async (): Promise<{ totalTime: number, highTime: number, mediumTime: number, lowTime: number }> => {
  const response = await axiosInstance.get('/avg-time');
  return response.data;
};
