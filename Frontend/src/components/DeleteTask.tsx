import React from "react";
import { deleteTaskById } from "../services/TaskService";

// Defining the props for DeleteTask component
interface DeleteTaskProps {
  taskId: number;
  onTaskDeleted: () => void;
}

// Defining the DeleteTask component
const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, onTaskDeleted }) => {
  // Function to handle task deletion
  const handleDelete = async () => {
    await deleteTaskById(taskId);
    onTaskDeleted();
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteTask;
