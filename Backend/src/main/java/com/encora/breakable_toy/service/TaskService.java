package com.encora.breakable_toy.service;

import com.encora.breakable_toy.entity.Task;
import com.encora.breakable_toy.repository.TaskRepository;
import com.encora.breakable_toy.utils.AverageTime;
import com.encora.breakable_toy.utils.Pages;
import com.encora.breakable_toy.utils.TaskValidator;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskValidator taskValidator;
    private final AverageTime averageTime;
    private final Pages pages;

    // Constructor to inject dependencies
    public TaskService(TaskRepository taskRepository, TaskValidator taskValidator, AverageTime averageTime, Pages pages) {
        this.taskRepository = taskRepository;
        this.taskValidator = taskValidator;
        this.averageTime = averageTime;
        this.pages = pages;
    }

    // Retrieve all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Create a new task
    public Task createTask(Task task) {
        taskValidator.validate(task); // Validate the task
        taskValidator.validateDoneField(task.isDone()); // Ensure 'done' field is not set
        Task createdTask = taskRepository.save(task); // Save the task
        pages.updateTotalPages(taskRepository.findAll().size()); // Update total pages
        return createdTask;
    }

    // Create multiple tasks
    public List<Task> createTasks(List<Task> tasks) {
        List<Task> createdTasks = new ArrayList<>();
        for (Task task : tasks) {
            createdTasks.add(createTask(task)); // Create each task
        }
        return createdTasks;
    }

    // Update an existing task
    public Task updateTask(Long id, Task updatedTask) {
        taskValidator.validate(updatedTask); // Validate the updated task
        Optional<Task> existingTaskOpt = taskRepository.findById(id);
        if (existingTaskOpt.isPresent()) {
            Task existingTask = existingTaskOpt.get();
            existingTask.setName(updatedTask.getName());
            existingTask.setPriority(updatedTask.getPriority());
            existingTask.setDueDate(updatedTask.getDueDate());
            return taskRepository.save(existingTask); // Save the updated task
        } else {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
    }

    // Mark a task as done
    public Task markAsDone(Long id) {
        Optional<Task> existingTaskOpt = taskRepository.findById(id);
        if (existingTaskOpt.isPresent()) {
            Task existingTask = existingTaskOpt.get();
            if (!existingTask.isDone()) {
                existingTask.setDone(true);
                existingTask.setDoneDate(LocalDateTime.now());
                taskRepository.save(existingTask); // Save the task as done
                updateAverageTime(existingTask); // Update average time
            }
            return existingTask;
        } else {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
    }

    // Mark a task as undone
    public Task markTaskAsUndone(Long id) {
        Optional<Task> existingTaskOpt = taskRepository.findById(id);
        if (existingTaskOpt.isPresent()) {
            Task existingTask = existingTaskOpt.get();
            if (existingTask.isDone()) {
                removeAverageTime(existingTask); // Remove average time
                existingTask.setDone(false);
                existingTask.setDoneDate(null);
                taskRepository.save(existingTask); // Save the task as undone
            }
            return existingTask;
        } else {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
    }

    // Delete a task by its ID
    public void deleteTask(Long id) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            if (task.isDone()) {
                removeAverageTime(task); // Remove average time
            }
            taskRepository.deleteById(id); // Delete the task
            pages.updateTotalPages(taskRepository.findAll().size()); // Update total pages
        } else {
            throw new NoSuchElementException("Task not found with id: " + id);
        }
    }

    // Update the average time to complete tasks
    private void updateAverageTime(Task task) {
        Duration duration = Duration.between(task.getCreationDate(), task.getDoneDate());
        averageTime.addTotalDuration(duration);
        switch (task.getPriority()) {
            case 2:
                averageTime.addHighDuration(duration);
                break;
            case 1:
                averageTime.addMediumDuration(duration);
                break;
            case 0:
                averageTime.addLowDuration(duration);
                break;
        }
    }

    // Remove the average time of a task
    private void removeAverageTime(Task task) {
        Duration duration = Duration.between(task.getCreationDate(), task.getDoneDate());
        averageTime.subtractTotalDuration(duration);
        switch (task.getPriority()) {
            case 2:
                averageTime.subtractHighDuration(duration);
                break;
            case 1:
                averageTime.subtractMediumDuration(duration);
                break;
            case 0:
                averageTime.subtractLowDuration(duration);
                break;
        }
    }

    // Get average times
    public AverageTime getAverageTimes() {
        return averageTime;
    }

    // Get pages
    public Pages getPages() {
        return pages;
    }

    // Retrieve all tasks sorted by priority
    public List<Task> getAllTasksSortedByPriority() {
        return taskRepository.findAllSortedByPriority();
    }

    // Retrieve all tasks sorted by due date
    public List<Task> getAllTasksSortedByDueDate() {
        return taskRepository.findAllSortedByDueDate();
    }

    // Retrieve all tasks sorted by priority and due date
    public List<Task> getAllTasksSortedByPriorityAndDueDate() {
        return taskRepository.findAllSortedByPriorityAndDueDate();
    }

    // Retrieve all tasks with sorting, filtering, and pagination
    public Map<String, Object> getAllTasks(String sortBy, String sortOrder, int page, Boolean done, String name, Integer priority) {
        Pages pages = getPages();

        if (page < 1) {
            throw new IllegalArgumentException("Page number must be greater than or equal to 1");
        }

        List<Task> tasks;

        if ("priority".equalsIgnoreCase(sortBy) && "dueDate".equalsIgnoreCase(sortOrder)) {
            tasks = getAllTasksSortedByPriorityAndDueDate();
        } else if ("priority".equalsIgnoreCase(sortBy)) {
            tasks = getAllTasksSortedByPriority();
        } else if ("dueDate".equalsIgnoreCase(sortBy)) {
            tasks = getAllTasksSortedByDueDate();
        } else {
            tasks = getAllTasks();
        }

        if (done != null) {
            tasks = tasks.stream().filter(task -> task.isDone() == done).collect(Collectors.toList());
        }

        if (name != null && !name.isEmpty()) {
            tasks = tasks.stream().filter(task -> task.getName().toLowerCase().contains(name.toLowerCase())).collect(Collectors.toList());
        }

        if (priority != null) {
            tasks = tasks.stream().filter(task -> task.getPriority() == priority).collect(Collectors.toList());
        }

        if (tasks.isEmpty()) {
            return Map.of("message", "No tasks found");
        }

        pages.setActualPage(page);
        int totalPages = pages.getTotalPages();

        if (page > totalPages) {
            throw new IllegalArgumentException("Page number exceeds total pages");
        }

        int start = (page - 1) * Pages.TASKS_PER_PAGE;
        int end = Math.min(start + Pages.TASKS_PER_PAGE, tasks.size());
        List<Task> paginatedTasks = tasks.subList(start, end);

        return Map.of("tasks", paginatedTasks, "currentPage", page, "totalPages", totalPages);
    }
}
