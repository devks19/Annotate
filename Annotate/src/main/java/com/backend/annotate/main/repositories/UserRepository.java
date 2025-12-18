package com.backend.annotate.main.repositories;

import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByTeamId(Long teamId);
    List<User> findByRole(UserRole role);

}