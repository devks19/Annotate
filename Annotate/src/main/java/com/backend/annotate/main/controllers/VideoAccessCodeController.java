package com.backend.annotate.main.controllers;

import com.backend.annotate.main.service.VideoAccessCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/video-access-code")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VideoAccessCodeController {

    private final VideoAccessCodeService accessCodeService;

    /**
     * Generate access code for a video (Creator only)
     */
    @PostMapping("/generate/{videoId}")
    public ResponseEntity<Map<String, String>> generateCode(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        String code = accessCodeService.generateAccessCode(videoId, userId);
        return ResponseEntity.ok(Map.of("accessCode", code));
    }

    /**
     * Get existing access code for a video (Creator only)
     */
    @GetMapping("/{videoId}")
    public ResponseEntity<Map<String, String>> getCode(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        String code = accessCodeService.getAccessCode(videoId, userId);
        return ResponseEntity.ok(Map.of("accessCode", code));
    }

    /**
     * Redeem access code (Viewer)
     */
    @PostMapping("/redeem")
    public ResponseEntity<Map<String, Boolean>> redeemCode(
            @RequestBody Map<String, String> body,
            @RequestAttribute("userId") Long userId
    ) {
        String code = body.get("code");
        boolean success = accessCodeService.redeemAccessCode(code, userId);
        return ResponseEntity.ok(Map.of("success", success));
    }

    /**
     * Disable access code for a video (Creator only)
     */
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> disableCode(
            @PathVariable Long videoId,
            @RequestAttribute("userId") Long userId
    ) {
        accessCodeService.disableAccessCode(videoId, userId);
        return ResponseEntity.noContent().build();
    }
}

