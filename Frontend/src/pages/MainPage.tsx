import React, { useState } from "react";
import { Container, Typography } from "@mui/material";
import SearchTask from "../components/SearchTask";
import AverageTime from "../components/AverageTime";
import TaskTable from "../components/TaskTable";
import { TaskProvider } from "../context/TaskContext";

// Defining the MainPage component
const MainPage: React.FC = () => {
  // State to manage search criteria
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    priority: "",
    done: "",
  });

  // Function to handle search criteria changes
  const handleSearch = (name: string, priority: string, done: string) => {
    setSearchCriteria({ name, priority, done });
  };

  // Function to handle task changes
  const handleTaskChange = () => {
    console.log("Task changed");
  };

  return (
    // Providing the TaskContext to all child components
    <TaskProvider>
      <Container sx={{ bgcolor: "#242424", padding: 5 }}>
        <Container sx={{ bgcolor: "#393939", padding: 3 }}>
          <Typography variant="h3">
            <strong>Breakable Toy: To Do App</strong>
          </Typography>
        </Container>
        {/* SearchTask component for searching tasks */}
        <SearchTask onSearch={handleSearch} />

        <Container sx={{ bgcolor: "#393939", padding: 3, marginTop: 3 }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            <strong>Task Table</strong>
          </Typography>
          {/* TaskTable component for displaying tasks */}
          <TaskTable
            onTaskChange={handleTaskChange}
            searchCriteria={searchCriteria}
          />
        </Container>
        {/* AverageTime component for displaying average time to complete tasks */}
        <AverageTime />
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            padding: 3,
          }}
        >
          Francisco Rafael Lezama Hernandez - Spark Program 2024 - Demo
        </Typography>
      </Container>
    </TaskProvider>
  );
};

// Exporting the MainPage component as the default export
export default MainPage;
