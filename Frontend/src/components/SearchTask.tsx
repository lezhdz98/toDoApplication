import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useTaskFilters } from "../hooks/useTaskFilters";

// Defining the props for SearchTask component
interface SearchTaskProps {
  onSearch: (name: string, priority: string, done: string) => void;
}

// Defining the SearchTask component
const SearchTask: React.FC<SearchTaskProps> = ({ onSearch }) => {
  // Using the custom hook to access filters context
  const { filters, setFilters } = useTaskFilters();

  // Handlers for input changes
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: event.target.value });
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    const priorityValue = event.target.value;
    setFilters({
      ...filters,
      priority: priorityValue ? parseInt(priorityValue) : undefined,
    });
  };

  const handleDoneChange = (event: SelectChangeEvent<string>) => {
    const doneValue = event.target.value;
    setFilters({
      ...filters,
      done: doneValue ? doneValue === "true" : undefined,
    });
  };

  // Handler for clear button click
  const handleClear = () => {
    setFilters({ name: "", priority: undefined, done: undefined });
    onSearch("", "", "");
  };

  return (
    <Box sx={{ bgcolor: "#202020", padding: 2, borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h4" gutterBottom>
        <strong>Search Tasks</strong>
      </Typography>
      <Box
        display="flex"
        justifyContent={"space-between"}
        flexDirection="row"
        gap={1}
        bgcolor="#ffffff"
        p={2}
        borderRadius={1}
      >
        <TextField
          label="Task Name"
          value={filters.name || ""}
          onChange={handleNameChange}
          sx={{ minWidth: 600 }}
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority?.toString() || ""}
            onChange={handlePriorityChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="0">Low</MenuItem>
            <MenuItem value="1">Medium</MenuItem>
            <MenuItem value="2">High</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.done?.toString() || ""}
            onChange={handleDoneChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Done</MenuItem>
            <MenuItem value="false">Undone</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{ minWidth: 120 }}
          variant="contained"
          onClick={handleClear}
        >
          Clear Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchTask;
