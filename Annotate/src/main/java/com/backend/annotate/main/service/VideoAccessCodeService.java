package com.backend.annotate.main.service;

import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.entities.VideoAccessPermission;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.enums.AccessStatus;
import com.backend.annotate.main.repositories.VideoRepository;
import com.backend.annotate.main.repositories.VideoAccessPermissionRepository;
import com.backend.annotate.main.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoAccessCodeService {

    private final VideoRepository videoRepository;
    private final VideoAccessPermissionRepository accessRepository;
    private final UserRepository userRepository;

    /**
     * Generate or regenerate access code for a video
     */
    @Transactional
    public String generateAccessCode(Long videoId, Long creatorId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        // Verify creator owns the video
        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can generate access code");
        }

        String code = generateUniqueCode();
        video.setAccessCode(code);
        video.setRequiresAccessCode(true);
        videoRepository.save(video);

        log.info("Generated access code {} for video {}", code, videoId);
        return code;
    }

    /**
     * Redeem access code to gain access to video
     */
    @Transactional
    public boolean redeemAccessCode(String code, Long userId) {
        Video video = videoRepository.findByAccessCode(code.toUpperCase().replace(" ", ""))
                .orElseThrow(() -> new RuntimeException("Invalid access code"));

        User viewer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if access already granted
        var existing = accessRepository.findByVideoIdAndViewerId(video.getId(), userId);
        if (existing.isPresent() && existing.get().getStatus() == AccessStatus.APPROVED) {
            return true; // Already has access
        }

        // Grant access automatically
        VideoAccessPermission permission = VideoAccessPermission.builder()
                .video(video)
                .viewer(viewer)
                .status(AccessStatus.APPROVED)
                .requestReason("Access code: " + code)
                .responseMessage("Automatic approval via access code")
                .build();

        accessRepository.save(permission);
        log.info("User {} gained access to video {} via code {}", userId, video.getId(), code);

        return true;
    }

    /**
     * Disable access code for a video
     */
    @Transactional
    public void disableAccessCode(Long videoId, Long creatorId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can disable access code");
        }

        video.setRequiresAccessCode(false);
        videoRepository.save(video);

        log.info("Disabled access code for video {}", videoId);
    }

    /**
     * Get access code for a video
     */
    public String getAccessCode(Long videoId, Long creatorId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (!video.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Only video creator can view access code");
        }

        if (!video.getRequiresAccessCode() || video.getAccessCode() == null) {
            throw new RuntimeException("Access code not enabled for this video");
        }

        return video.getAccessCode();
    }

    private String generateUniqueCode() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();

        // Generate until unique
        String generatedCode;
        do {
            code.setLength(0);
            for (int i = 0; i < 8; i++) {
                code.append(chars.charAt(random.nextInt(chars.length())));
                if (i == 3) code.append("-");
            }
            generatedCode = code.toString();
        } while (videoRepository.findByAccessCode(generatedCode).isPresent());

        return generatedCode;
    }
}

