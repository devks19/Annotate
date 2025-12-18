package com.backend.annotate.main.repositories;

import com.backend.annotate.main.entities.VideoAccessPermission;
import com.backend.annotate.main.enums.AccessStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoAccessPermissionRepository extends JpaRepository<VideoAccessPermission, Long> {

    Optional<VideoAccessPermission> findByVideoIdAndViewerId(Long videoId, Long viewerId);

    List<VideoAccessPermission> findByVideoCreatorIdAndStatus(Long creatorId, AccessStatus status);

    List<VideoAccessPermission> findByViewerId(Long viewerId);

    boolean existsByVideoIdAndViewerIdAndStatus(Long videoId, Long viewerId, AccessStatus status);

    List<VideoAccessPermission> findByVideoCreatorId(Long creatorId);

    List<VideoAccessPermission> findByViewerIdAndStatus(Long viewerId, AccessStatus status);

    Optional<VideoAccessPermission> findByVideoIdAndViewerIdAndStatus(Long videoId, Long viewerId, AccessStatus status);

    List<VideoAccessPermission> findByVideoId(Long videoId);
}
