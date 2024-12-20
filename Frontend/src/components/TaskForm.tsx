import React, { useState, useEffect } from "react";
import { Task } from "../models/Task";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useTasks } from "../hooks/useTasks";
import { TaskInput } from "../context/TaskContext"; // Import TaskInput type

// Defining the props for TaskForm component
interface TaskFormProps {
  task?: Task | null;
  onTaskSaved: () => void;
}

// Defining the TaskForm component
const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskSaved }) => {
  const { createTask, updateTask } = useTasks(); // Using the custom hook to access task context
  const [name, setName] = useState(task?.name || ""); // State to manage task name
  const [priority, setPriority] = useState<0 | 1 | 2>(task?.priority ?? 0); // State to manage task priority
  const [dueDate, setDueDate] = useState(task?.dueDate || ""); // State to manage task due date
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors

  // Effect to update state when the task prop changes
  useEffect(() => {
    if (task) {
      setName(task.name);
      setPriority(task.priority);
      setDueDate(task.dueDate || "");
    }
  }, [task]);

  // Function to check if a date is in the past
  const isDateInPast = (date: string): boolean => {
    const selectedDate = new Date(date);
    const now = new Date();
    return selectedDate < now;
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const taskInput: TaskInput = { name, priority, dueDate };

    try {
      if (task) {
        await updateTask(task.id, taskInput);
      } else {
        await createTask(taskInput);
      }
      onTaskSaved();
    } catch (err) {
      setError("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {/* Task Name Input */}
      <TextField
        label="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {/* Priority Select */}
      <Select
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as 0 | 1 | 2)}
        required
      >
        <MenuItem value={0}>Low</MenuItem>
        <MenuItem value={1}>Medium</MenuItem>
        <MenuItem value={2}>High</MenuItem>
      </Select>
      {/* Due Date Input */}

      <TextField
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        InputProps={{
          inputProps: { min: new Date().toISOString().split("T")[0] }, // Prevent selecting past dates
        }}
        error={!!dueDate && isDateInPast(dueDate)} // Show error if due date is in the past
        helperText={
          dueDate && isDateInPast(dueDate)
            ? "Due date cannot be in the past"
            : ""
        }
      />
      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading || (dueDate ? isDateInPast(dueDate) : false)} // Disable button if loading or due date is in the past
      >
        {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
      </Button>
      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default TaskForm;
