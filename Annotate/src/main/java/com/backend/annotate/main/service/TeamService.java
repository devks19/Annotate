package com.backend.annotate.main.service;

import com.backend.annotate.main.dto.TeamRequest;
import com.backend.annotate.main.entities.Team;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.enums.UserRole;
import com.backend.annotate.main.repositories.TeamRepository;
import com.backend.annotate.main.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    @Transactional
    public Team createTeam(Long adminId, TeamRequest request) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can create teams");
        }

        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .admin(admin)
                .build();

        return teamRepository.save(team);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    @Transactional
    public void addMemberToTeam(Long teamId, Long userId) {
        Team team = getTeamById(teamId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTeam(team);
        userRepository.save(user);
    }
}
