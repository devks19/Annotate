package com.backend.annotate.main.repositories;

import com.backend.annotate.main.entities.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCreatorId(Long creatorId);
    List<Video> findByTeamId(Long teamId);
    List<Video> findByIsPublishedTrue();
    List<Video> findByIsPublishedFalse();

    int countByCreatorId(Long creatorId);

    Optional<Video> findByAccessCode(String accessCode);
}