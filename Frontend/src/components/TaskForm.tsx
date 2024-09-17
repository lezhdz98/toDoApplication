import React, { useState, useEffect } from "react";
import { Task } from "../models/Task";
import { createTask, updateTask } from "../services/TaskService";
import { TextField, Select, MenuItem, Button, Box } from "@mui/material";

// Defining the props for TaskForm component
interface TaskFormProps {
  task?: Task | null;
  onTaskSaved: () => void;
}

// Defining the TaskForm component
const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskSaved }) => {
  // State to manage task name, priority, and due date
  const [name, setName] = useState(task?.name || "");
  const [priority, setPriority] = useState<0 | 1 | 2>(task?.priority ?? 0);
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

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

  // Function to get a future date by adding minutes to the current time
  const getFutureDate = (minutes: number): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return now.toISOString().slice(0, 16); // Format 'YYYY-MM-DDTHH:MM'
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let formattedDueDate = dueDate ? new Date(dueDate).toISOString() : null;

    if (dueDate === new Date().toISOString().slice(0, 10)) {
      formattedDueDate = getFutureDate(5);
    }

    if (formattedDueDate && isDateInPast(formattedDueDate)) {
      alert("Due date cannot be in the past");
      return;
    }

    if (task) {
      await updateTask(task.id, { name, priority, dueDate: formattedDueDate });
    } else {
      await createTask({ name, priority, dueDate: formattedDueDate });
    }
    onTaskSaved();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "#333",
        padding: 2,
        borderRadius: 2,
        color: "white",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <TextField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Task Name"
        required
        variant="outlined"
        sx={{
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#007BFF" },
          },
          backgroundColor: "#444",
        }}
      />
      <Select
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value) as 0 | 1 | 2)}
        variant="outlined"
        sx={{
          color: "white",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#007BFF" },
          },
          backgroundColor: "#444",
        }}
      >
        <MenuItem value={0}>Low</MenuItem>
        <MenuItem value={1}>Medium</MenuItem>
        <MenuItem value={2}>High</MenuItem>
      </Select>
      <TextField
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        variant="outlined"
        sx={{
          input: { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#555" },
            "&:hover fieldset": { borderColor: "#777" },
            "&.Mui-focused fieldset": { borderColor: "#007BFF" },
          },
          backgroundColor: "#444",
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#007BFF",
          color: "white",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        {task ? "Update Task" : "Create Task"}
      </Button>
    </Box>
  );
};

export default TaskForm;
