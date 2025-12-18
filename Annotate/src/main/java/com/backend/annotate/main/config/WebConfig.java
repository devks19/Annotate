//package com.backend.annotate.main.config;
//
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//import java.nio.file.Paths;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Value("${file.upload.dir:uploads/videos}")
//    private String uploadDir;
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
//    }
//
////    @Override
////    public void addResourceHandlers(ResourceHandlerRegistry registry) {
////        // Serve uploaded videos
////        registry.addResourceHandler("/uploads/videos/**")
////                .addResourceLocations("file:" + uploadDir + "/");
////    }
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // Get absolute path
//        String absolutePath = Paths.get(uploadDir).toAbsolutePath().toUri().toString();
//
//        // Serve uploaded videos
//        registry.addResourceHandler("/uploads/videos/**")
//                .addResourceLocations(absolutePath)
//                .setCachePeriod(3600);
//
//        System.out.println("Serving videos from: " + absolutePath);
//    }
//}
//

package com.backend.annotate.main.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir:uploads/videos}")
    private String uploadDir;

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
//                .allowedMethods("*")
//                .allowedHeaders("*")
//                .allowCredentials(true)
//                .maxAge(3600);
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert to absolute path
        Path absolutePath = Paths.get(uploadDir).toAbsolutePath();
        String fileLocation = "file:" + absolutePath.toString() + "/";

        // Normalize path separators for cross-platform compatibility
        fileLocation = fileLocation.replace("\\", "/");

        registry.addResourceHandler("/uploads/videos/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(0);

        System.out.println("==========================================");
        System.out.println("Serving uploaded videos from: " + fileLocation);
        System.out.println("==========================================");
    }
}

