import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

// Defining the props for SearchTask component
interface SearchTaskProps {
  onSearch: (name: string, priority: string, done: string) => void;
}

// Defining the SearchTask component
const SearchTask: React.FC<SearchTaskProps> = ({ onSearch }) => {
  // State to manage search criteria
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [done, setDone] = useState<string>("");

  // Handlers for input changes
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handlePriorityChange = (event: SelectChangeEvent<string>) => {
    setPriority(event.target.value as string);
  };

  const handleDoneChange = (event: SelectChangeEvent<string>) => {
    setDone(event.target.value as string);
  };

  // Handler for search button click
  const handleSearch = () => {
    onSearch(name, priority, done);
  };

  // Handler for clear button click
  const handleClear = () => {
    setName("");
    setPriority("");
    setDone("");
    onSearch("", "", ""); // Call onSearch with empty values to show all tasks
  };

  return (
    <>
      <Container sx={{ display: "flex", bgcolor: "#202020", padding: 1 }}>
        <Typography variant="h4">
          <strong>Search Task</strong>
        </Typography>
      </Container>
      <Container
        sx={{ display: "flex", height: "8vh", bgcolor: "#dedede", padding: 1 }}
      >
        <Box sx={{ minWidth: 250, marginRight: "15px" }}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
            fullWidth
          />
        </Box>
        <Box sx={{ minWidth: 150, marginRight: "15px" }}>
          <FormControl fullWidth>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={priority}
              onChange={handlePriorityChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="0">Low</MenuItem>
              <MenuItem value="1">Medium</MenuItem>
              <MenuItem value="2">High</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 150, marginRight: "15px" }}>
          <FormControl fullWidth>
            <InputLabel id="done-select-label">State</InputLabel>
            <Select
              labelId="done-select-label"
              id="done-select"
              value={done}
              onChange={handleDoneChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Done</MenuItem>
              <MenuItem value="false">Undone</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ height: "50px" }}
            onClick={handleSearch}
          >
            <strong>Search</strong>
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ height: "50px" }}
            onClick={handleClear}
          >
            <strong>Clear</strong>
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SearchTask;
