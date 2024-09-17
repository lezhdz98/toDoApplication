// /models/Task.ts

export interface Task {
  id: number;
  name: string;
  done: boolean;
  priority: 0 | 1 | 2; // Solo acepta 0, 1 o 2
  creationDate: string; 
  doneDate: string | null;
  dueDate: string | null;
}
