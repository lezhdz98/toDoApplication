import React, { useEffect, useState } from "react";
import { Task } from "../models/Task";
import TaskForm from "./TaskForm";
import DeleteTask from "./DeleteTask";
import MarkTaskStatus from "./MarkTaskStatus";
import {
  Container,
  Paper,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTasks } from "../hooks/useTasks";
import { usePagination } from "../hooks/usePagination";
import { useTaskFilters } from "../hooks/useTaskFilters";

// Defining the props for TaskTable component
interface TaskTableProps {
  onTaskChange: () => void;
  searchCriteria: {
    name: string;
    priority: string;
    done: string;
  };
}

// Defining the TaskTable component
const TaskTable: React.FC<TaskTableProps> = ({
  onTaskChange,
  searchCriteria,
}) => {
  const { tasks, fetchTasks } = useTasks(); // Using the custom hook to access task context
  const { currentPage, setPage, totalPages } = usePagination(); // Using the custom hook to access pagination context
  const { filters, setFilters } = useTaskFilters(); // Using the custom hook to access filters context
  const [openDialog, setOpenDialog] = useState(false); // State to manage dialog open/close
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // State to manage selected task

  // Effect to update filters when search criteria change
  useEffect(() => {
    setFilters({
      ...searchCriteria,
      priority: searchCriteria.priority
        ? parseInt(searchCriteria.priority)
        : undefined,
      done: searchCriteria.done ? searchCriteria.done === "true" : undefined,
    });
  }, [searchCriteria, setFilters]);

  // Function to handle dialog open
  const handleOpenDialog = (task: Task | null = null) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    onTaskChange();
  };

  // Function to get the label for task priority
  const getPriorityLabel = (priority?: number): string => {
    switch (priority) {
      case 0:
        return "Low";
      case 1:
        return "Medium";
      case 2:
        return "High";
      default:
        return "Unknown";
    }
  };

  // Function to format the date string
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Function to handle previous page button click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  // Function to handle next page button click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  // Function to handle sorting
  const handleSort = (sortBy: string) => {
    setFilters({ ...filters, sortBy });
    fetchTasks();
  };

  // Function to clear sorting
  const handleClearSort = () => {
    setFilters({ ...filters, sortBy: undefined });
    fetchTasks();
  };

  // Function to get the background color based on the due date
  const getRowBackgroundColor = (dueDate?: string | null): string => {
    if (!dueDate) return "";
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "red";
    if (diffDays <= 14) return "yellow";
    return "#4cbb17";
  };

  return (
    <Container>
      <Paper>
        {/* Top section with Create Task button and sort buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Create Task
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="h6">Sort By:</Typography>

            <ButtonGroup variant="outlined" size="small">
              <Button onClick={() => handleSort("both")}>
                Priority and Due Date
              </Button>
              <Button onClick={() => handleSort("priority")}>Priority</Button>
              <Button onClick={() => handleSort("dueDate")}>Due Date</Button>
              <Button variant="contained" onClick={handleClearSort}>
                Clear Sort
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        {/* Task Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{
                    backgroundColor: getRowBackgroundColor(task.dueDate),
                    textDecoration: task.done ? "line-through" : "none",
                  }}
                >
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{getPriorityLabel(task.priority)}</TableCell>
                  <TableCell>
                    {task.dueDate ? formatDate(task.dueDate) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <MarkTaskStatus
                      taskId={task.id}
                      done={task.done}
                      onStatusChanged={fetchTasks}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpenDialog(task)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DeleteTask taskId={task.id} onTaskDeleted={fetchTasks} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Box sx={{ margin: "0 15px", paddingTop: "10px" }}>
            <strong>
              Page {currentPage} of {totalPages}
            </strong>
          </Box>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Paper>
      {/* Dialog for creating/updating a task */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedTask ? "Update Task" : "Create Task"}
        </DialogTitle>
        <DialogContent>
          <TaskForm task={selectedTask} onTaskSaved={handleCloseDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskTable;
