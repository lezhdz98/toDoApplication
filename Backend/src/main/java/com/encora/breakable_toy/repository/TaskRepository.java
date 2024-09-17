package com.encora.breakable_toy.repository;

import com.encora.breakable_toy.entity.Task;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

@Repository
public class TaskRepository {

    private HashMap<Long, Task> taskTable = new HashMap<>();
    private long currentId = 1;

    // Retrieve all tasks
    public List<Task> findAll() {
        return new ArrayList<>(taskTable.values());
    }

    // Find a task by its ID
    public Optional<Task> findById(Long id) {
        return Optional.ofNullable(taskTable.get(id));
    }

    // Save a task
    public Task save(Task task) {
        if (task.getId() == null) {
            task.setId(currentId++);
        }
        taskTable.put(task.getId(), task);
        return task;
    }

    // Delete a task by its ID
    public void deleteById(Long id) {
        taskTable.remove(id);
    }

    // Retrieve all tasks sorted by priority (descending)
    public List<Task> findAllSortedByPriority() {
        return taskTable.values().stream()
                .sorted(Comparator.comparingInt(Task::getPriority).reversed())
                .collect(Collectors.toList());
    }

    // Retrieve all tasks sorted by due date
    public List<Task> findAllSortedByDueDate() {
        return taskTable.values().stream()
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }

    // Retrieve all tasks sorted by priority (descending) and due date
    public List<Task> findAllSortedByPriorityAndDueDate() {
        return taskTable.values().stream()
                .sorted(Comparator.comparingInt(Task::getPriority).reversed()
                        .thenComparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .collect(Collectors.toList());
    }
}
