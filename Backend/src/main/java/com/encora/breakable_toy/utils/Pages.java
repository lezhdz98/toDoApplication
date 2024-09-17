package com.encora.breakable_toy.utils;

import org.springframework.stereotype.Component;

@Component
public class Pages {
    // Total number of pages
    private int totalPages;
    // Current page the user is viewing
    private int actualPage;
    // Constant defining the number of tasks per page
    public static final int TASKS_PER_PAGE = 10;

    // Getter to obtain the total number of pages
    public int getTotalPages() {
        return totalPages;
    }

    // Setter to set the total number of pages based on the total number of tasks
    public void setTotalPages(int totalTasks) {
        // Calculate the total number of pages rounding up
        this.totalPages = (int) Math.ceil((double) totalTasks / TASKS_PER_PAGE);
    }

    // Getter to obtain the current page
    public int getActualPage() {
        return actualPage;
    }

    // Setter to set the current page, ensuring it is within the valid range
    public void setActualPage(int actualPage) {
        if (actualPage < 1 || actualPage > totalPages) {
            throw new IllegalArgumentException("Invalid page number");
        }
        this.actualPage = actualPage;
    }

    // Method to update the total number of pages
    public void updateTotalPages(int totalTasks) {
        setTotalPages(totalTasks);
    }

    // Method to advance to the next page, if possible
    public void nextPage() {
        if (actualPage < totalPages) {
            actualPage++;
        }
    }

    // Method to go back to the previous page, if possible
    public void previousPage() {
        if (actualPage > 1) {
            actualPage--;
        }
    }
}
