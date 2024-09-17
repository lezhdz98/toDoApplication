import React, { useEffect, useState } from "react";
import { Task } from "../models/Task";
import { getTasks } from "../services/TaskService";
import TaskForm from "./TaskForm";
import DeleteTask from "./DeleteTask";
import MarkTaskStatus from "./MarkTaskStatus";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import {
  Container,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

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
  // State to manage tasks, current page, total pages, dialog open state, selected task, and sort model
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // Function to fetch tasks from the server
  const fetchTasks = async (
    page: number,
    sortBy?: string[],
    sortOrder?: string[]
  ) => {
    try {
      const response = await getTasks(
        sortBy,
        sortOrder,
        page,
        searchCriteria.done === "" ? undefined : searchCriteria.done === "true",
        searchCriteria.name,
        searchCriteria.priority === ""
          ? undefined
          : parseInt(searchCriteria.priority)
      );
      const {
        tasks,
        currentPage: fetchedPage,
        totalPages: fetchedTotalPages,
      } = response;
      setTasks(tasks || []);
      setCurrentPage(fetchedPage);
      setTotalPages(fetchedTotalPages);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  // Fetch tasks when the component mounts or when currentPage, searchCriteria, or sortModel changes
  useEffect(() => {
    const sortBy = sortModel.map((model) => model.field);
    const sortOrder = sortModel
      .map((model) => model.sort)
      .filter((sort) => sort !== null) as string[];
    fetchTasks(currentPage, sortBy, sortOrder);
  }, [currentPage, searchCriteria, sortModel]);

  // Function to handle task save action
  const handleTaskSaved = () => {
    fetchTasks(currentPage);
    setOpen(false);
    onTaskChange();
  };

  // Function to handle task delete action
  const handleTaskDeleted = () => {
    fetchTasks(currentPage);
    onTaskChange();
  };

  // Function to handle task status change action
  const handleStatusChanged = () => {
    fetchTasks(currentPage);
    onTaskChange();
  };

  // Function to handle previous page action
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle next page action
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to open the dialog for creating or updating a task
  const handleClickOpen = (task?: Task) => {
    setSelectedTask(task || null);
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  // Function to get the label for task priority
  const getPriorityLabel = (priority: number): string => {
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

  // Defining the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "priority",
      headerName: "Priority",
      width: 130,
      renderCell: (params) => getPriorityLabel(params.value),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "done",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (params.value ? "Completed" : "Pending"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <>
          <MarkTaskStatus
            taskId={params.row.id}
            done={params.row.done}
            onStatusChanged={handleStatusChanged}
          />
          <button onClick={() => handleClickOpen(params.row)}>Update</button>
          <DeleteTask
            taskId={params.row.id}
            onTaskDeleted={handleTaskDeleted}
          />
        </>
      ),
    },
  ];

  return (
    <Container>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
      >
        Create Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedTask ? "Update Task" : "Create Task"}
        </DialogTitle>
        <DialogContent>
          <TaskForm task={selectedTask} onTaskSaved={handleTaskSaved} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ height: 640, width: "100%", marginTop: 2 }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSizeOptions={[10]}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
        />
      </Paper>
      <Container
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Box sx={{ marginRight: "15px" }}>
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
        </Box>
        <Box sx={{ marginRight: "15px", paddingTop: "10px" }}>
          <strong>
            Page {currentPage} of {totalPages}
          </strong>
        </Box>
        <Box>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </Box>
      </Container>
    </Container>
  );
};

export default TaskTable;
