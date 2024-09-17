import React, { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useTasks } from "../context/TaskContext";

// Defining the AverageTime component
const AverageTime: React.FC = () => {
  // Using the custom hook to access tasks context
  const { averageTime, updateAverageTime } = useTasks();

  // Effect to update average time when the component mounts
  useEffect(() => {
    updateAverageTime();
  }, [updateAverageTime]);

  return (
    <Container sx={{ bgcolor: "#1185cd" }}>
      <Container sx={{ display: "flex", padding: 1 }}>
        <Box sx={{ marginRight: "5px" }}>
          <Typography variant="h6">
            <strong>Average Time To Finish Task:</strong>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6">
            <strong>{averageTime.totalTime} minutes</strong>
          </Typography>
        </Box>
      </Container>
      <Container sx={{ display: "flex", padding: 1 }}>
        <Box>
          <Typography variant="h6">
            <strong>Average Time To Finish Task By Priority:</strong>
          </Typography>
        </Box>
      </Container>
      <Container sx={{ display: "flex", paddingBottom: 1 }}>
        <Box sx={{ marginRight: "5px" }}>
          <Typography variant="h6">
            <strong>High:</strong>
          </Typography>
        </Box>
        <Box sx={{ marginRight: "15px" }}>
          <Typography variant="h6">
            <strong>{averageTime.highTime} minutes</strong>
          </Typography>
        </Box>
        <Box sx={{ marginRight: "5px" }}>
          <Typography variant="h6">
            <strong>Medium:</strong>
          </Typography>
        </Box>
        <Box sx={{ marginRight: "15px" }}>
          <Typography variant="h6">
            <strong>{averageTime.mediumTime} minutes</strong>
          </Typography>
        </Box>
        <Box sx={{ marginRight: "5px" }}>
          <Typography variant="h6">
            <strong>Low:</strong>
          </Typography>
        </Box>
        <Box sx={{ marginRight: "15px" }}>
          <Typography variant="h6">
            <strong>{averageTime.lowTime} minutes</strong>
          </Typography>
        </Box>
      </Container>
    </Container>
  );
};

export default AverageTime;
