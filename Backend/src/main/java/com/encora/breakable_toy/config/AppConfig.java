package com.encora.breakable_toy.config;

import com.encora.breakable_toy.utils.AverageTime;
import com.encora.breakable_toy.utils.Pages;
import com.encora.breakable_toy.utils.TaskValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    // This method defines a TaskValidator bean
    @Bean
    public TaskValidator taskValidator() {
        return new TaskValidator();
    }

    // This method defines an AverageTime bean
    @Bean
    public AverageTime averageTime() {
        return new AverageTime();
    }

    // This method defines a Pages bean
    @Bean
    public Pages pages() {
        return new Pages();
    }
}
