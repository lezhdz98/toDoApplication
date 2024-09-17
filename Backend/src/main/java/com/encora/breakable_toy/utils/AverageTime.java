package com.encora.breakable_toy.utils;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalTime;

@Component
public class AverageTime {
    // Variables to store total time and times by priority
    private LocalTime totalTime = LocalTime.of(0, 0);
    private LocalTime highTime = LocalTime.of(0, 0);
    private LocalTime mediumTime = LocalTime.of(0, 0);
    private LocalTime lowTime = LocalTime.of(0, 0);

    // Counters for the number of tasks by priority
    private long totalCount = 0;
    private long highCount = 0;
    private long mediumCount = 0;
    private long lowCount = 0;

    // Getters to obtain average times in minutes
    public long getTotalTimeInMinutes() {
        return getTimeInMinutes(calculateAverageTime(totalTime, totalCount));
    }

    public long getHighTimeInMinutes() {
        return getTimeInMinutes(calculateAverageTime(highTime, highCount));
    }

    public long getMediumTimeInMinutes() {
        return getTimeInMinutes(calculateAverageTime(mediumTime, mediumCount));
    }

    public long getLowTimeInMinutes() {
        return getTimeInMinutes(calculateAverageTime(lowTime, lowCount));
    }

    // Method to add a duration to a specific time
    private LocalTime addDuration(Duration duration, LocalTime time) {
        return time.plusSeconds(duration.getSeconds());
    }

    // Method to subtract a duration from a specific time
    private LocalTime subtractDuration(Duration duration, LocalTime time) {
        return time.minusSeconds(duration.getSeconds());
    }

    // Public methods to add durations to the respective times
    public void addTotalDuration(Duration duration) {
        totalTime = addDuration(duration, totalTime);
        totalCount++;
    }

    public void addHighDuration(Duration duration) {
        highTime = addDuration(duration, highTime);
        highCount++;
    }

    public void addMediumDuration(Duration duration) {
        mediumTime = addDuration(duration, mediumTime);
        mediumCount++;
    }

    public void addLowDuration(Duration duration) {
        lowTime = addDuration(duration, lowTime);
        lowCount++;
    }

    // Public methods to subtract durations from the respective times
    public void subtractTotalDuration(Duration duration) {
        totalTime = subtractDuration(duration, totalTime);
        totalCount--;
    }

    public void subtractHighDuration(Duration duration) {
        highTime = subtractDuration(duration, highTime);
        highCount--;
    }

    public void subtractMediumDuration(Duration duration) {
        mediumTime = subtractDuration(duration, mediumTime);
        mediumCount--;
    }

    public void subtractLowDuration(Duration duration) {
        lowTime = subtractDuration(duration, lowTime);
        lowCount--;
    }

    // Method to calculate average time based on total time and count
    private LocalTime calculateAverageTime(LocalTime totalTime, long count) {
        if (count == 0) {
            return LocalTime.of(0, 0);
        }
        long averageSeconds = totalTime.toSecondOfDay() / count;
        return LocalTime.ofSecondOfDay(averageSeconds);
    }

    // Method to get time in minutes
    public long getTimeInMinutes(LocalTime time) {
        return time.toSecondOfDay() / 60;
    }
}
