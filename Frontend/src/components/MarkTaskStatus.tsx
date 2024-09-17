import React from "react";
import { markTaskAsDone, markTaskAsUndone } from "../services/TaskService";

// Defining the props for MarkTaskStatus component
interface MarkTaskStatusProps {
  taskId: number;
  done: boolean;
  onStatusChanged: () => void;
}

// Defining the MarkTaskStatus component
const MarkTaskStatus: React.FC<MarkTaskStatusProps> = ({
  taskId,
  done,
  onStatusChanged,
}) => {
  // Function to toggle the task status
  const handleToggleStatus = async () => {
    if (done) {
      await markTaskAsUndone(taskId);
    } else {
      await markTaskAsDone(taskId);
    }
    onStatusChanged();
  };

  return (
    <button onClick={handleToggleStatus}>{done ? "Undone" : "Done"}</button>
  );
};

export default MarkTaskStatus;
