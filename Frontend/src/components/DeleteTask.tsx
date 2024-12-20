import React, { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { Button } from "@mui/material";

// Defining the props for DeleteTask component
interface DeleteTaskProps {
  taskId: number;
  onTaskDeleted: () => void;
}

// Defining the DeleteTask component
const DeleteTask: React.FC<DeleteTaskProps> = ({ taskId, onTaskDeleted }) => {
  const { deleteTask } = useTasks(); // Using the custom hook to access task context
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors

  // Function to handle task deletion
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(taskId);
      onTaskDeleted();
    } catch (err) {
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        color="error"
        variant="contained"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteTask;
