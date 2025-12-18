package com.backend.annotate.main.entities;

import com.backend.annotate.main.enums.AccessStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_access_permissions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"video_id", "viewer_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoAccessPermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "viewer_id", nullable = false)
    private User viewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessStatus status = AccessStatus.PENDING;

    @Column(length = 500)
    private String requestReason;

    @Column(length = 500)
    private String responseMessage;

    private LocalDateTime suspendedUntil;   // for temporary removal

    @Column(nullable = false)
    private boolean revoked = false;        // for permanent removal


    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime respondedAt;

    @PrePersist
    protected void onCreate() {
        requestedAt = LocalDateTime.now();
    }
}
