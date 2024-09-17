package com.encora.breakable_toy.utils;

import com.encora.breakable_toy.entity.Task;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TaskValidator {

    // Validate the entire task
    public void validate(Task task) {
        validateName(task.getName());
        validatePriority(task.getPriority());
        validateDueDate(task.getDueDate());
    }

    // Validate the task name
    public void validateName(String name) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Task name cannot be null or empty");
        }
        if (name.length() > 120) {
            throw new IllegalArgumentException("Task name cannot exceed 120 characters");
        }
    }

    // Validate the task priority
    public void validatePriority(int priority) {
        if (priority < 0 || priority > 2) {
            throw new IllegalArgumentException("Task priority must be 0 = Low, 1 = Medium or 2 = High");
        }
    }

    // Validate the task due date
    public void validateDueDate(LocalDateTime dueDate) {
        if (dueDate != null && dueDate.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Due date cannot be in the past");
        }
    }

    // Ensure the 'done' field is not set when creating a task
    public void validateDoneField(boolean done) {
        if (done) {
            throw new IllegalArgumentException("The 'done' field cannot be set when creating a task");
        }
    }
}
