package com.trackify.controller;

import com.trackify.dto.PlaylistRequest;
import com.trackify.dto.PlaylistResponse;
import com.trackify.model.CalculationHistory;
import com.trackify.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    /**
     * Calculate total duration for one or more playlist/video URLs.
     */
    @PostMapping("/calculate")
    public ResponseEntity<PlaylistResponse> calculate(@Valid @RequestBody PlaylistRequest request) throws IOException {
        PlaylistResponse response = playlistService.calculate(
                request.getUrls(),
                request.getStartIndex(),
                request.getEndIndex(),
                request.getMinutesPerDay()
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Get recent calculation history.
     */
    @GetMapping("/history")
    public ResponseEntity<List<CalculationHistory>> getHistory() {
        return ResponseEntity.ok(playlistService.getRecentHistory());
    }
}
