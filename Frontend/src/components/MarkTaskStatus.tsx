import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useTasks } from "../hooks/useTasks";

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
  const { markTaskAsDone, markTaskAsUndone } = useTasks(); // Using the custom hook to access task context
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors

  // Function to toggle the task status
  const handleToggleStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Marking task as done: " + taskId);
      if (done) {
        await markTaskAsUndone(taskId);
      } else {
        await markTaskAsDone(taskId);
      }
      onStatusChanged();
    } catch (err) {
      setError("Failed to change task status");
      console.error("Failed to change task status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={done}
            onChange={handleToggleStatus}
            disabled={loading}
          />
        }
        label={loading ? "Updating..." : done ? "Done" : "Undone"}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MarkTaskStatus;
