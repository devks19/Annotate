package com.backend.annotate.main.service;

import com.backend.annotate.main.dto.AccessRequest;

import com.backend.annotate.main.dto.AccessResponse;

import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.entities.VideoAccessPermission;
import com.backend.annotate.main.enums.AccessStatus;
import com.backend.annotate.main.repositories.UserRepository;
import com.backend.annotate.main.repositories.VideoAccessPermissionRepository;
import com.backend.annotate.main.repositories.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoAccessService {

    private final VideoAccessPermissionRepository accessRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    /**
     * Check if user has access to view video
     */
//    public boolean hasAccess(Long videoId, Long userId) {
//        Video video = videoRepository.findById(videoId)
//                .orElseThrow(() -> new RuntimeException("Video not found"));
//
//        // Creator always has access to their own videos
//        if (video.getCreator().getId().equals(userId)) {
//            return true;
//        }
//
//        // Check if video is published AND user has approved access
//        return video.getIsPublished() &&
//                accessRepository.existsByVideoIdAndViewerIdAndStatus(
//                        videoId, userId, AccessStatus.APPROVED
//                );
//    }

    public boolean hasAccess(Long videoId, Long userId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Creator always has access
        if (video.getCreator().getId().equals(userId)) {
            return true;
        }

        // Must be published
        if (!video.getIsPublished()) {
            return false;
        }

        // Check approved permission
        var optionalPermission = accessRepository
                .findByVideoIdAndViewerIdAndStatus(videoId, userId, AccessStatus.APPROVED);

        if (optionalPermission.isEmpty()) {
            return false;
        }

        VideoAccessPermission permission = optionalPermission.get();

        // Permanent removal
        if (permission.isRevoked()) {
            return false;
        }

        //  Temporary removal (suspended)
        LocalDateTime now = LocalDateTime.now();
        if (permission.getSuspendedUntil() != null &&
                permission.getSuspendedUntil().isAfter(now)) {
            return false;
        }


        return true;
    }




    /**
     * Request access to a video
     */
    @Transactional
    public AccessResponse requestAccess(Long userId, AccessRequest request) {
        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        User viewer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if request already exists
        var existing = accessRepository.findByVideoIdAndViewerId(
                request.getVideoId(), userId
        );

        if (existing.isPresent()) {
            throw new RuntimeException("Access request already exists");
        }

        // Create new request
        VideoAccessPermission permission = VideoAccessPermission.builder()
                .video(video)
                .viewer(viewer)
                .status(AccessStatus.PENDING)
                .requestReason(request.getRequestReason())
                .build();

        permission = accessRepository.save(permission);

        return mapToDTO(permission);
    }

    /**
     * Approve access request
     */
    @Transactional
    public AccessResponse approveAccess(Long requestId, Long creatorId, String message) {
        VideoAccessPermission permission = accessRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Access request not found"));

        // Verify creator owns the video
        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can approve access");
        }

        permission.setStatus(AccessStatus.APPROVED);
        permission.setResponseMessage(message);
        permission.setRespondedAt(LocalDateTime.now());

        permission = accessRepository.save(permission);
        log.info("Access approved for viewer {} to video {}",
                permission.getViewer().getId(), permission.getVideo().getId());

        return mapToDTO(permission);
    }

    /**
     * Deny access request
     */
    @Transactional
    public AccessResponse denyAccess(Long requestId, Long creatorId, String message) {
        VideoAccessPermission permission = accessRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Access request not found"));

        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can deny access");
        }

        permission.setStatus(AccessStatus.DENIED);
        permission.setResponseMessage(message);
        permission.setRespondedAt(LocalDateTime.now());

        permission = accessRepository.save(permission);

        return mapToDTO(permission);
    }

    /**
     * Get pending requests for creator
     */
    public List<AccessResponse> getPendingRequests(Long creatorId) {
        return accessRepository.findByVideoCreatorIdAndStatus(creatorId, AccessStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user's access requests
     */
    public List<AccessResponse> getMyRequests(Long userId) {
        return accessRepository.findByViewerId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AccessResponse mapToDTO(VideoAccessPermission permission) {
        return AccessResponse.builder()
                .id(permission.getId())
                .videoId(permission.getVideo().getId())
                .videoTitle(permission.getVideo().getTitle())
                .viewerId(permission.getViewer().getId())
                .viewerName(permission.getViewer().getName())
                .status(permission.getStatus())
                .requestReason(permission.getRequestReason())
                .responseMessage(permission.getResponseMessage())
                .requestedAt(permission.getRequestedAt())
                .respondedAt(permission.getRespondedAt())
                .revoked(permission.isRevoked())
                .suspendedUntil(permission.getSuspendedUntil())
                .build();
    }

    /**
     * Revoke access from a viewer
     */
    @Transactional
    public void revokeAccess(Long requestId, Long creatorId) {
        VideoAccessPermission permission = accessRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Access permission not found"));

        // Verify creator owns the video
        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can revoke access");
        }

        // Delete the permission entirely
        accessRepository.delete(permission);
        log.info("Access revoked for viewer {} from video {}",
                permission.getViewer().getId(), permission.getVideo().getId());
    }

    /**
     * Get all approved access for creator's videos
     */
    public List<AccessResponse> getApprovedAccess(Long creatorId) {
        return accessRepository.findByVideoCreatorIdAndStatus(creatorId, AccessStatus.APPROVED)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * TEMPORARY access removal (suspend viewer until a specific time)
     */
    @Transactional
    public AccessResponse suspendAccess(Long permissionId, Long creatorId, LocalDateTime suspendedUntil) {
        VideoAccessPermission permission = accessRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Access permission not found"));

        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can suspend access");
        }

        permission.setSuspendedUntil(suspendedUntil);
        permission.setRevoked(false); // not permanent

        permission = accessRepository.save(permission);
        return mapToDTO(permission);
    }

    /**
     * PERMANENT access removal
     */
    @Transactional
    public AccessResponse revokeAccessPermanently(Long permissionId, Long creatorId, String message) {
        VideoAccessPermission permission = accessRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Access permission not found"));

        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can revoke access");
        }

        permission.setRevoked(true);
        permission.setSuspendedUntil(null);
        permission.setStatus(AccessStatus.APPROVED); // keep history (was approved)
        permission.setResponseMessage(message);
        permission.setRespondedAt(LocalDateTime.now());

        permission = accessRepository.save(permission);
        log.info("Permanently revoked access for viewer {} from video {}",
                permission.getViewer().getId(), permission.getVideo().getId());

        return mapToDTO(permission);
    }

    /**
     * Restore access (clear temporary suspension / permanent revoke)
     */
    @Transactional
    public AccessResponse restoreAccess(Long permissionId, Long creatorId) {
        VideoAccessPermission permission = accessRepository.findById(permissionId)
                .orElseThrow(() -> new RuntimeException("Access permission not found"));

        if (!permission.getVideo().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can restore access");
        }

        permission.setRevoked(false);
        permission.setSuspendedUntil(null);

        permission = accessRepository.save(permission);
        return mapToDTO(permission);
    }

    /**
     * ACCESS VIEWER: get all viewers for one video
     */
    public List<AccessResponse> getAccessForVideo(Long creatorId, Long videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can view access list");
        }

        return accessRepository.findByVideoId(videoId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }



}
