package com.encora.breakable_toy.controller;

import com.encora.breakable_toy.entity.Task;
import com.encora.breakable_toy.service.TaskService;
import com.encora.breakable_toy.utils.AverageTime;
import com.encora.breakable_toy.utils.Pages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:8080")
public class TaskController {

    private final TaskService taskService;

    // Constructor to inject TaskService
    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Endpoint to retrieve all tasks with sorting, filtering, and pagination
    @GetMapping("/todos")
    public ResponseEntity<Map<String, Object>> getAllTasks(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer priority) {
        try {
            // Call the service to get tasks
            Map<String, Object> response = taskService.getAllTasks(sortBy, sortOrder, page, done, name, priority);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Return a bad request response if there is an error
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to create a new task
    @PostMapping("/todos")
    public ResponseEntity<Map<String, String>> createTask(@RequestBody Task task) {
        try {
            // Call the service to create a task
            Task createdTask = taskService.createTask(task);
            // Build the URI for the created task
            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(createdTask.getId())
                    .toUri();
            return ResponseEntity.created(location).body(Map.of("id", createdTask.getId().toString()));
        } catch (IllegalArgumentException e) {
            // Return a bad request response if there is an error
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to create multiple tasks
    @PostMapping("/todoslist")
    public ResponseEntity<Map<String, Object>> createTasks(@RequestBody List<Task> tasks) {
        try {
            // Call the service to create multiple tasks
            List<Task> createdTasks = taskService.createTasks(tasks);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("createdTasks", createdTasks));
        } catch (IllegalArgumentException e) {
            // Return a bad request response if there is an error
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to update an existing task
    @PutMapping("/todos/{id}")
    public ResponseEntity<Map<String, String>> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        try {
            // Call the service to update the task
            Task task = taskService.updateTask(id, updatedTask);
            return ResponseEntity.ok(Map.of("message", "Task updated successfully", "id", task.getId().toString()));
        } catch (NoSuchElementException e) {
            // Return a not found response if the task does not exist
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            // Return a bad request response if there is an error
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to mark a task as done
    @PostMapping("/todos/{id}/done")
    public ResponseEntity<Map<String, String>> markTaskAsDone(@PathVariable Long id) {
        try {
            // Call the service to mark the task as done
            Task task = taskService.markAsDone(id);
            return ResponseEntity.ok(Map.of("message", "Task marked as done", "id", task.getId().toString()));
        } catch (NoSuchElementException e) {
            // Return a not found response if the task does not exist
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to mark a task as undone
    @PutMapping("/todos/{id}/undone")
    public ResponseEntity<Map<String, String>> markTaskAsUndone(@PathVariable Long id) {
        try {
            // Call the service to mark the task as undone
            Task task = taskService.markTaskAsUndone(id);
            return ResponseEntity.ok(Map.of("message", "Task marked as undone", "id", task.getId().toString()));
        } catch (NoSuchElementException e) {
            // Return a not found response if the task does not exist
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Return an internal server error response if there is an unexpected error
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint to delete a task by its ID
    @DeleteMapping("/todos/{id}/delete")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        // Call the service to delete the task
        taskService.deleteTask(id);
        // Return a no content response
        return ResponseEntity.noContent().build();
    }

    // Endpoint to get the average time to complete tasks
    @GetMapping("/avg-time")
    public ResponseEntity<Map<String, Long>> getAverageTime() {
        // Call the service to get average times
        AverageTime averageTime = taskService.getAverageTimes();
        Map<String, Long> response = new HashMap<>();
        response.put("totalTime", averageTime.getTotalTimeInMinutes());
        response.put("highTime", averageTime.getHighTimeInMinutes());
        response.put("mediumTime", averageTime.getMediumTimeInMinutes());
        response.put("lowTime", averageTime.getLowTimeInMinutes());
        return ResponseEntity.ok(response);
    }

}
