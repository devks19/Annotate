//package com.backend.annotate.main.controllers;
//
//import com.backend.annotate.main.dto.UserResponse;
//import com.backend.annotate.main.entities.User;
//import com.backend.annotate.main.entities.VideoAccessPermission;
//import com.backend.annotate.main.enums.AccessStatus;
//import com.backend.annotate.main.enums.UserRole;
//import com.backend.annotate.main.repositories.UserRepository;
//import com.backend.annotate.main.repositories.VideoAccessPermissionRepository;
//import com.backend.annotate.main.repositories.VideoRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.context.request.RequestContextHolder;
//import org.springframework.web.context.request.ServletRequestAttributes;
//
//import java.util.List;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Slf4j
//@RestController
//@RequestMapping("/api/users")
//@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
//public class UserController {
//
//    private final UserRepository userRepository;
//    private final VideoRepository videoRepository;
//    private final VideoAccessPermissionRepository accessRepository;
//
//    /**
//     * Get all creators (for viewer dashboard)
//     */
//    @GetMapping("/creators")
//    public ResponseEntity<List<UserResponse>> getCreators() {
//        log.info("Fetching all creators");
//
//        List<User> creators = userRepository.findByRole(UserRole.CREATOR);
//
//        List<UserResponse> response = creators.stream()
//                .map(user -> {
//                    int videoCount = videoRepository.countByCreatorId(user.getId());
//
//                    return UserResponse.builder()
//                            .id(user.getId())
//                            .name(user.getName())
//                            .email(user.getEmail())
//                            .role(user.getRole())
//                            .videoCount(videoCount)
//                            .build();
//                })
//                .collect(Collectors.toList());
//
//        log.info("Found {} creators", response.size());
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Get creator details by ID
//     */
//    @GetMapping("/creators/{id}")
//    public ResponseEntity<UserResponse> getCreatorById(@PathVariable Long id) {
//        User creator = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Creator not found"));
//
//        if (creator.getRole() != UserRole.CREATOR) {
//            throw new RuntimeException("User is not a creator");
//        }
//
//        int videoCount = videoRepository.countByCreatorId(id);
//
//        UserResponse response = UserResponse.builder()
//                .id(creator.getId())
//                .name(creator.getName())
//                .email(creator.getEmail())
//                .role(creator.getRole())
//                .videoCount(videoCount)
//                .build();
//
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * Get current user profile
//     */
//    @GetMapping("/profile")
//    public ResponseEntity<UserResponse> getCurrentUser(
//            @RequestAttribute("userId") Long userId
//    ) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        UserResponse response = UserResponse.builder()
//                .id(user.getId())
//                .name(user.getName())
//                .email(user.getEmail())
//                .role(user.getRole())
//                .build();
//
//        return ResponseEntity.ok(response);
//    }
//
//
//
//}
//

package com.backend.annotate.main.controllers;

import com.backend.annotate.main.dto.UserResponse;
import com.backend.annotate.main.entities.User;
import com.backend.annotate.main.entities.VideoAccessPermission;
import com.backend.annotate.main.enums.AccessStatus;
import com.backend.annotate.main.repositories.UserRepository;
import com.backend.annotate.main.repositories.VideoAccessPermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final VideoAccessPermissionRepository accessRepository;

    /**
     * Get all creators
     */
    @GetMapping("/creators")
    public ResponseEntity<List<UserResponse>> getCreators() {
        List<User> creators = userRepository.findByRole(com.backend.annotate.main.enums.UserRole.CREATOR);
        return ResponseEntity.ok(
                creators.stream()
                        .map(this::mapToBasicResponse)
                        .collect(Collectors.toList())
        );
    }

    /**
     * Get creators whose videos the viewer has access to
     */
    @GetMapping("/accessible-creators")
    public ResponseEntity<List<UserResponse>> getAccessibleCreators(
            @RequestAttribute("userId") Long userId
    ) {
        log.info("Getting accessible creators for user: {}", userId);

        // Get all approved access permissions for this viewer
        List<VideoAccessPermission> approvedAccess = accessRepository
                .findByViewerIdAndStatus(userId, AccessStatus.APPROVED);

        // Extract unique creators
        Set<User> creators = approvedAccess.stream()
                .map(permission -> permission.getVideo().getCreator())
                .collect(Collectors.toSet());

        log.info("Found {} accessible creators for user {}", creators.size(), userId);

        // Map with video count for this specific viewer
        return ResponseEntity.ok(
                creators.stream()
                        .map(creator -> mapToResponseWithAccessCount(creator, userId))
                        .collect(Collectors.toList())
        );
    }

    /**
     * Get creator by ID
     */
    @GetMapping("/creators/{id}")
    public ResponseEntity<UserResponse> getCreatorById(@PathVariable Long id) {
        User creator = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        return ResponseEntity.ok(mapToBasicResponse(creator));
    }

    // Simple mapper without video count
    private UserResponse mapToBasicResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .videoCount(0) // Will be calculated if needed
                .build();
    }

    // Mapper with accessible video count for specific viewer
    private UserResponse mapToResponseWithAccessCount(User creator, Long viewerId) {
        // Count how many videos this viewer can access from this creator
        int accessibleVideoCount = (int) accessRepository
                .findByViewerIdAndStatus(viewerId, AccessStatus.APPROVED)
                .stream()
                .filter(perm -> perm.getVideo().getCreator().getId().equals(creator.getId()))
                .count();

        return UserResponse.builder()
                .id(creator.getId())
                .name(creator.getName())
                .email(creator.getEmail())
                .role(creator.getRole())
                .videoCount(accessibleVideoCount)
                .build();
    }
}

