package com.backend.annotate.main.controllers;

import com.backend.annotate.main.dto.AccessRequest;
import com.backend.annotate.main.dto.AccessResponse;
import com.backend.annotate.main.service.VideoAccessService;
import com.backend.annotate.main.dto.SuspendAccessRequest;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video-access")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VideoAccessController {

    private final VideoAccessService accessService;

    /**
     * Request access to a video
     */
    @PostMapping("/request")
    public ResponseEntity<AccessResponse> requestAccess(
            @RequestAttribute("userId") Long userId,
            @RequestBody AccessRequest request
    ) {
        return ResponseEntity.ok(accessService.requestAccess(userId, request));
    }

    /**
     * Approve access request
     */
    @PutMapping("/{requestId}/approve")
    public ResponseEntity<AccessResponse> approveAccess(
            @PathVariable Long requestId,
            @RequestAttribute("userId") Long userId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String message = body != null ? body.get("message") : null;
        return ResponseEntity.ok(accessService.approveAccess(requestId, userId, message));
    }

    /**
     * Deny access request
     */
    @PutMapping("/{requestId}/deny")
    public ResponseEntity<AccessResponse> denyAccess(
            @PathVariable Long requestId,
            @RequestAttribute("userId") Long userId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String message = body != null ? body.get("message") : null;
        return ResponseEntity.ok(accessService.denyAccess(requestId, userId, message));
    }

    /**
     * Get pending requests for creator
     */
    @GetMapping("/pending")
    public ResponseEntity<List<AccessResponse>> getPendingRequests(
            @RequestAttribute("userId") Long userId
    ) {
        return ResponseEntity.ok(accessService.getPendingRequests(userId));
    }

    /**
     * Get my access requests
     */
    @GetMapping("/my-requests")
    public ResponseEntity<List<AccessResponse>> getMyRequests(
            @RequestAttribute("userId") Long userId
    ) {
        return ResponseEntity.ok(accessService.getMyRequests(userId));
    }

    /**
     * Check if user has access to video
     */
    @GetMapping("/check/{videoId}")
    public ResponseEntity<Map<String, Boolean>> checkAccess(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        boolean hasAccess = accessService.hasAccess(videoId, userId);
        return ResponseEntity.ok(Map.of("hasAccess", hasAccess));
    }

    /**
     * Revoke access from a viewer
     */
    @DeleteMapping("/{requestId}/revoke")
    public ResponseEntity<Void> revokeAccess(
            @PathVariable Long requestId,
            @RequestAttribute("userId") Long userId
    ) {
        accessService.revokeAccess(requestId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all approved access for creator's videos
     */
    @GetMapping("/approved")
    public ResponseEntity<List<AccessResponse>> getApprovedAccess(
            @RequestAttribute("userId") Long userId
    ) {
        return ResponseEntity.ok(accessService.getApprovedAccess(userId));
    }

    /**
     * TEMPORARY access removal
     */
    @PutMapping("/{permissionId}/suspend")
    public ResponseEntity<AccessResponse> suspendAccess(
            @PathVariable Long permissionId,
            @RequestAttribute("userId") Long userId,
            @RequestBody SuspendAccessRequest request
    ) {
        return ResponseEntity.ok(
                accessService.suspendAccess(permissionId, userId, request.getSuspendedUntil())
        );
    }

    /**
     * PERMANENT access removal
     */
    @PutMapping("/{permissionId}/revoke-permanent")
    public ResponseEntity<AccessResponse> revokeAccessPermanently(
            @PathVariable Long permissionId,
            @RequestAttribute("userId") Long userId,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String message = body != null ? body.get("message") : null;
        return ResponseEntity.ok(
                accessService.revokeAccessPermanently(permissionId, userId, message)
        );
    }

    /**
     * Restore access (undo temp/permanent removal)
     */
    @PutMapping("/{permissionId}/restore")
    public ResponseEntity<AccessResponse> restoreAccess(
            @PathVariable Long permissionId,
            @RequestAttribute("userId") Long userId
    ) {
        return ResponseEntity.ok(accessService.restoreAccess(permissionId, userId));
    }

    /**
     * ACCESS VIEWER – all viewers for a particular video
     */
    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<AccessResponse>> getAccessForVideo(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        return ResponseEntity.ok(accessService.getAccessForVideo(userId, videoId));
    }

}
