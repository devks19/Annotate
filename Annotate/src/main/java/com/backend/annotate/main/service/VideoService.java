package com.backend.annotate.main.service;

import com.backend.annotate.main.dto.VideoUploadRequest;
import com.backend.annotate.main.entities.Team;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.enums.UserRole;
import com.backend.annotate.main.repositories.TeamRepository;
import com.backend.annotate.main.repositories.UserRepository;
import com.backend.annotate.main.repositories.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


import com.backend.annotate.main.dto.VideoUploadRequest;
import com.backend.annotate.main.entities.Team;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.enums.UserRole;
import com.backend.annotate.main.repositories.TeamRepository;
import com.backend.annotate.main.repositories.UserRepository;
import com.backend.annotate.main.repositories.VideoRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoService {
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    @Value("${file.upload.dir:uploads/videos}")
    private String uploadDir;

    @Value("${file.upload.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * Initialize upload directory on application startup
     */
    @PostConstruct
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            } else {
                log.info("Upload directory exists: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory", e);
            throw new RuntimeException("Could not create upload directory: " + e.getMessage());
        }
    }

    /**
     * Upload video file from local system
     */


    @Transactional
    public Video uploadVideoFile(Long creatorId, MultipartFile file, String title, String description) {


        try {
            // Get absolute path
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath();

            // LOG where trying to save
            System.out.println("=================================");
            System.out.println("Upload directory: " + uploadDir);
            System.out.println("Absolute path: " + uploadPath);
            System.out.println("Directory exists: " + Files.exists(uploadPath));
            System.out.println("=================================");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created directory: " + uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".mp4";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file to disk
            Path filePath = uploadPath.resolve(uniqueFilename);

            // LOG exact save location
            System.out.println("Saving file to: " + filePath.toAbsolutePath());

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // VERIFY FILE WAS SAVED
            if (Files.exists(filePath)) {
                System.out.println("File saved successfully!");
                System.out.println("File size: " + Files.size(filePath) + " bytes");
            } else {
                System.out.println("File was NOT saved!");
            }

            log.info("File saved to: {}", filePath.toAbsolutePath());

            // Generate video URL
            String videoUrl = baseUrl + "/uploads/videos/" + uniqueFilename;
            User creator = userRepository.findById(creatorId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + creatorId));

            // Create video entity
            Video video = Video.builder()
                    .title(title)
                    .description(description != null ? description : "")
                    .videoUrl(videoUrl)
                    .thumbnailUrl(null)
                    .durationSeconds(0)
                    .creator(creator)
                    .isPublished(true)
                    .build();

            log.info("Video file uploaded and published: {}", uniqueFilename);
            return videoRepository.save(video);

        } catch (IOException e) {
            log.error("Failed to upload video file", e);
            e.printStackTrace(); // PRINT FULL STACK TRACE
            throw new RuntimeException("Failed to upload video file: " + e.getMessage());
        }
    }


    /**
     * Upload video via URL (existing method)
     */
    @Transactional
    public Video uploadVideo(Long creatorId, VideoUploadRequest request) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        if (creator.getRole() != UserRole.CREATOR && creator.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only creators can upload videos");
        }

        Video video = Video.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .videoUrl(request.getVideoUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .durationSeconds(request.getDurationSeconds())
                .creator(creator)
                .isPublished(true) // ← AUTO PUBLISH - CHANGED FROM FALSE
                .build();

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new RuntimeException("Team not found"));
            video.setTeam(team);
        }

        return videoRepository.save(video);
    }

    /**
     * Publish video
     */
    @Transactional
    public Video publishVideo(Long videoId, Long creatorId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only the creator can publish this video");
        }

        video.setIsPublished(true);
        return videoRepository.save(video);
    }

    /**
     * Unpublish video (make it draft)
     */
    @Transactional
    public Video unpublishVideo(Long videoId, Long creatorId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only the creator can unpublish this video");
        }

        video.setIsPublished(false);
        return videoRepository.save(video);
    }

    /**
     * Get videos by creator (includes both published and unpublished)
     */
    public List<Video> getVideosByCreator(Long creatorId) {
        return videoRepository.findByCreatorId(creatorId);
    }

    /**
     * Get all published videos (visible to everyone)
     */
    public List<Video> getPublishedVideos() {
        return videoRepository.findByIsPublishedTrue();
    }

    /**
     * Get all videos (admin only)
     */
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    /**
     * Get video by ID
     */
    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
    }

    /**
     * Delete video and associated file
     */
    @Transactional
    public void deleteVideo(Long videoId, Long userId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Check if user is creator or admin
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!video.getCreator().getId().equals(userId) && user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only the creator or admin can delete this video");
        }

        // Delete file from disk if it exists locally
        try {
            if (video.getVideoUrl().contains("/uploads/videos/")) {
                String filename = video.getVideoUrl().substring(video.getVideoUrl().lastIndexOf("/") + 1);
                Path filePath = Paths.get(uploadDir).resolve(filename);
                if (Files.deleteIfExists(filePath)) {
                    log.info("Video file deleted: {}", filename);
                } else {
                    log.warn("Video file not found for deletion: {}", filename);
                }
            }
        } catch (IOException e) {
            log.error("Failed to delete video file", e);
        }

        videoRepository.delete(video);
        log.info("Video deleted from database: {}", videoId);
    }

    /**
     * Bulk publish all videos (admin utility)
     */
    @Transactional
    public void publishAllVideos(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can bulk publish videos");
        }

        List<Video> unpublishedVideos = videoRepository.findByIsPublishedFalse();
        unpublishedVideos.forEach(video -> video.setIsPublished(true));
        videoRepository.saveAll(unpublishedVideos);

        log.info("Published {} videos", unpublishedVideos.size());
    }
}



