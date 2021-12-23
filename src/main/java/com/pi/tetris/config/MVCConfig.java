package com.pi.tetris.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("login");
        registry.addViewController("/figures").setViewName("figures");
        registry.addViewController("/create-figure").setViewName("create-figure");
        registry.addViewController("/info-system").setViewName("info-system");
        registry.addViewController("/info-students").setViewName("info-students");
    }
}
