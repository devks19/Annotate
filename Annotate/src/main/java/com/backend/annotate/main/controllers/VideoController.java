package com.backend.annotate.main.controllers;

import com.backend.annotate.main.dto.UserResponse;
import com.backend.annotate.main.dto.VideoResponse;
import com.backend.annotate.main.dto.VideoUploadRequest;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.entities.VideoAccessPermission;
import com.backend.annotate.main.enums.AccessStatus;
import com.backend.annotate.main.repositories.VideoAccessPermissionRepository;
import com.backend.annotate.main.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


import com.backend.annotate.main.dto.VideoUploadRequest;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Slf4j
//@CrossOrigin(origins = "*")
public class VideoController {
    private final VideoService videoService;
    private final VideoAccessPermissionRepository accessRepository;

    /**
     * Upload video file from local system
     */
//    @PostMapping(value = "/upload-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<Video> uploadVideoFile(
//            @RequestAttribute("userId") Long creatorId,
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("title") String title,
//            @RequestParam(value = "description", required = false) String description
//    ) {
//        return ResponseEntity.ok(videoService.uploadVideoFile(creatorId, file, title, description));
//    }

    @PostMapping(value = "/upload-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Video> uploadVideoFile(
            @RequestAttribute("userId") Long creatorId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description
    ) {
        log.info("Received file upload request: {} - Size: {} bytes", file.getOriginalFilename(), file.getSize());

        try {
            Video video = videoService.uploadVideoFile(creatorId, file, title, description);
            log.info("Video uploaded successfully: {}", video.getId());
            return ResponseEntity.ok(video);
        } catch (Exception e) {
            log.error("Error uploading video file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Upload video via URL
     */
    @PostMapping("/upload")
    public ResponseEntity<Video> uploadVideo(
            @RequestAttribute("userId") Long creatorId,
            @Valid @RequestBody VideoUploadRequest request
    ) {
        return ResponseEntity.ok(videoService.uploadVideo(creatorId, request));
    }

    /**
     * Publish video
     */
    @PutMapping("/{videoId}/publish")
    public ResponseEntity<Video> publishVideo(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long creatorId
    ) {
        return ResponseEntity.ok(videoService.publishVideo(videoId, creatorId));
    }

    /**
     * Get all videos accessible by the current user (for viewers)
     */
    @GetMapping("/accessible")
    public ResponseEntity<List<VideoResponse>> getAccessibleVideos(
            @RequestAttribute("userId") Long userId
    ) {
        List<VideoAccessPermission> approvedAccess = accessRepository
                .findByViewerIdAndStatus(userId, AccessStatus.APPROVED);

        List<Video> accessibleVideos = approvedAccess.stream()
                .map(VideoAccessPermission::getVideo)
                .filter(Video::getIsPublished)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                accessibleVideos.stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList())
        );
    }

    /**
     * Get videos by creator
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<Video>> getVideosByCreator(@PathVariable Long creatorId) {
        return ResponseEntity.ok(videoService.getVideosByCreator(creatorId));
    }

    /**
     * Get all published videos
     */
    @GetMapping("/published")
    public ResponseEntity<List<Video>> getPublishedVideos() {
        return ResponseEntity.ok(videoService.getPublishedVideos());
    }

    /**
     * Get video by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideo(@PathVariable Long id) {
        return ResponseEntity.ok(videoService.getVideoById(id));
    }

    /**
     * Delete video
     */
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        videoService.deleteVideo(videoId, userId);
        return ResponseEntity.noContent().build();
    }



    // helper method to convert Video entity to VideoResponse
    private VideoResponse mapToResponse(Video video) {
        return VideoResponse.builder()
                .id(video.getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .videoUrl(video.getVideoUrl())
                .thumbnailUrl(video.getThumbnailUrl())
                .durationSeconds(video.getDurationSeconds())
                .isPublished(video.getIsPublished())
                .creator(mapUserToResponse(video.getCreator()))
                .createdAt(video.getCreatedAt())
                .accessCode(video.getAccessCode())
                .requiresAccessCode(video.getRequiresAccessCode())
                .build();
    }

    // helper method to convert User to UserResponse
    private UserResponse mapUserToResponse(com.backend.annotate.main.entities.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

}

