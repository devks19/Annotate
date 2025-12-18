package com.backend.annotate.main.service;

import com.backend.annotate.main.dto.FeedbackRequest;
import com.backend.annotate.main.entities.Feedback;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.entities.Video;
import com.backend.annotate.main.enums.FeedbackStatus;
import com.backend.annotate.main.enums.UserRole;
import com.backend.annotate.main.repositories.FeedbackRepository;
import com.backend.annotate.main.repositories.UserRepository;
import com.backend.annotate.main.repositories.VideoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    @Transactional
    public Feedback createFeedback(Long viewerId, FeedbackRequest request) {
        User viewer = userRepository.findById(viewerId)
                .orElseThrow(() -> new RuntimeException("Viewer not found"));

        Video video = videoRepository.findById(request.getVideoId())
                .orElseThrow(() -> new RuntimeException("Video not found"));

        Feedback feedback = Feedback.builder()
                .video(video)
                .viewer(viewer)
                .comment(request.getComment())
                .timestampSeconds(request.getTimestampSeconds())
                .status(FeedbackStatus.PENDING)
                .build();

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbacksByVideo(Long videoId) {
        return feedbackRepository.findByVideoIdOrderByTimestampSecondsAsc(videoId);
    }

    public Feedback updateFeedbackStatus(Long feedbackId, FeedbackStatus status) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setStatus(status);
        if (status == FeedbackStatus.ACCEPTED) {
            feedback.setResolvedAt(java.time.LocalDateTime.now());
        }

        return feedbackRepository.save(feedback);
    }

    @Transactional
    public Feedback approveFeedback(Long feedbackId, Long userId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only creator of video or admin can approve
        if (!feedback.getVideo().getCreator().getId().equals(userId)
                && user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only creator or admin can approve feedback");
        }

        feedback.setStatus(FeedbackStatus.ACCEPTED);
        return feedbackRepository.save(feedback);
    }

    @Transactional
    public Feedback rejectFeedback(Long feedbackId, Long userId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!feedback.getVideo().getCreator().getId().equals(userId)
                && user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only creator or admin can reject feedback");
        }

        feedback.setStatus(FeedbackStatus.REJECTED);
        return feedbackRepository.save(feedback);
    }
}
