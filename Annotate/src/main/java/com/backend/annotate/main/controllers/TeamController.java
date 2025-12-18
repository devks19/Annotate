package com.backend.annotate.main.controllers;

import com.backend.annotate.main.dto.TeamRequest;
import com.backend.annotate.main.entities.Team;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.service.TeamService;
import com.backend.annotate.main.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Team> createTeam(
            @RequestAttribute("userId") Long adminId,
            @Valid @RequestBody TeamRequest request
    ) {
        return ResponseEntity.ok(teamService.createTeam(adminId, request));
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Void> addMemberToTeam(
            @PathVariable Long teamId,
            @PathVariable Long userId
    ) {
        teamService.addMemberToTeam(teamId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<User>> getTeamMembers(@PathVariable Long teamId) {
        return ResponseEntity.ok(userService.getUsersByTeam(teamId));
    }
}
