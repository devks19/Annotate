package com.backend.annotate.main.config;


import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class MultipartConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();

        // Maximum file size
        factory.setMaxFileSize(DataSize.ofMegabytes(500));

        // Maximum request size
        factory.setMaxRequestSize(DataSize.ofMegabytes(500));

        // File size threshold after which files will be written to disk
        factory.setFileSizeThreshold(DataSize.ofMegabytes(2));

        return factory.createMultipartConfig();
    }
}

