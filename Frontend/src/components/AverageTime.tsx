import React, { useEffect } from "react";
import { Container, Box, Typography, Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAverageTime } from "../hooks/useAverageTime";

// Using the custom hook to access average time context
const AverageTime: React.FC = () => {
  const { averageTime, fetchAverageTime } = useAverageTime();

  // Effect to fetch average time when the component mounts
  useEffect(() => {
    if (averageTime.totalTime === 0) {
      fetchAverageTime();
    }
  }, [averageTime.totalTime, fetchAverageTime]);

  return (
    <Container sx={{ bgcolor: "#202020", padding: 2 }}>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <AccessTimeIcon fontSize="large" color="primary" />
            <Box>
              <Typography variant="h5" component="div">
                <strong>Average Time To Finish Task:</strong>
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {averageTime.totalTime} minutes
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            <strong>Average Time To Finish Task By Priority:</strong>
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            gap={2}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  Priority High
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {averageTime.highTime} minutes
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  Priority Medium
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {averageTime.mediumTime} minutes
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div">
                  Priority Low
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {averageTime.lowTime} minutes
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AverageTime;
