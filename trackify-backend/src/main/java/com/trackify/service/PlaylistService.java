package com.trackify.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trackify.dto.PlaylistResponse;
import com.trackify.dto.PlaylistResponse.*;
import com.trackify.model.CalculationHistory;
import com.trackify.repository.CalculationHistoryRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    private final YouTubeApiService youTubeApiService;
    private final CalculationHistoryRepository historyRepository;
    private final ObjectMapper objectMapper;

    private static final double[] SPEEDS = {1.0, 1.25, 1.5, 1.75, 2.0};
    private static final String[] SPEED_LABELS = {"1x", "1.25x", "1.5x", "1.75x", "2x"};

    public PlaylistService(YouTubeApiService youTubeApiService,
                           CalculationHistoryRepository historyRepository,
                           ObjectMapper objectMapper) {
        this.youTubeApiService = youTubeApiService;
        this.historyRepository = historyRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Main calculation method — processes one or more URLs and returns full results.
     */
    public PlaylistResponse calculate(List<String> urls, Integer startIndex, Integer endIndex, Integer minutesPerDay) throws IOException {
        List<PlaylistResult> results = new ArrayList<>();
        long overallTotalSeconds = 0;
        int overallTotalVideos = 0;

        for (String url : urls) {
            url = url.trim();
            if (url.isEmpty()) continue;

            PlaylistResult result;

            if (youTubeApiService.isSingleVideoUrl(url)) {
                result = processSingleVideo(url);
            } else {
                result = processPlaylist(url, startIndex, endIndex);
            }

            // Calculate speed breakdown
            result.setSpeeds(calculateSpeeds(result.getTotalSeconds()));

            // Calculate daily plan if minutesPerDay is provided
            if (minutesPerDay != null && minutesPerDay > 0) {
                result.setDailyPlan(calculateDailyPlan(result.getTotalSeconds(), minutesPerDay));
            }

            results.add(result);
            overallTotalSeconds += result.getTotalSeconds();
            overallTotalVideos += result.getVideoCount();
        }

        // Build overall summary
        OverallSummary summary = new OverallSummary(
                results.size(),
                overallTotalVideos,
                overallTotalSeconds,
                formatDuration(overallTotalSeconds)
        );

        PlaylistResponse response = new PlaylistResponse(results, summary);

        // Save to history
        saveToHistory(urls, results, overallTotalSeconds, overallTotalVideos);

        return response;
    }

    /**
     * Process a single video URL.
     */
    private PlaylistResult processSingleVideo(String url) throws IOException {
        String videoId = youTubeApiService.extractVideoId(url);
        long duration = youTubeApiService.fetchSingleVideoDuration(videoId);
        String title = youTubeApiService.fetchVideoTitle(videoId);

        PlaylistResult result = new PlaylistResult();
        result.setPlaylistTitle(title);
        result.setPlaylistId(videoId);
        result.setVideoCount(1);
        result.setTotalSeconds(duration);
        result.setFormattedDuration(formatDuration(duration));
        result.setAverageDuration(formatDuration(duration));

        return result;
    }

    /**
     * Process a playlist URL with optional video range.
     */
    private PlaylistResult processPlaylist(String url, Integer startIndex, Integer endIndex) throws IOException {
        String playlistId = youTubeApiService.extractPlaylistId(url);
        String title = youTubeApiService.fetchPlaylistTitle(playlistId);
        List<String> allVideoIds = youTubeApiService.fetchPlaylistVideoIds(playlistId);

        // Apply video range filter (1-based indexing)
        List<String> filteredVideoIds = applyVideoRange(allVideoIds, startIndex, endIndex);

        // Fetch durations for filtered videos
        List<Long> durations = youTubeApiService.fetchVideoDurations(filteredVideoIds);

        long totalSeconds = durations.stream().mapToLong(Long::longValue).sum();
        int videoCount = filteredVideoIds.size();
        long averageSeconds = videoCount > 0 ? totalSeconds / videoCount : 0;

        PlaylistResult result = new PlaylistResult();
        result.setPlaylistTitle(title);
        result.setPlaylistId(playlistId);
        result.setVideoCount(videoCount);
        result.setTotalSeconds(totalSeconds);
        result.setFormattedDuration(formatDuration(totalSeconds));
        result.setAverageDuration(formatDuration(averageSeconds));

        return result;
    }

    /**
     * Apply video range filter (1-based indexing).
     */
    private List<String> applyVideoRange(List<String> videoIds, Integer startIndex, Integer endIndex) {
        if (startIndex == null && endIndex == null) {
            return videoIds;
        }

        int start = (startIndex != null && startIndex > 0) ? startIndex - 1 : 0;
        int end = (endIndex != null && endIndex > 0) ? Math.min(endIndex, videoIds.size()) : videoIds.size();

        if (start >= videoIds.size()) {
            start = 0;
        }
        if (end > videoIds.size()) {
            end = videoIds.size();
        }
        if (start >= end) {
            return videoIds;
        }

        return videoIds.subList(start, end);
    }

    /**
     * Calculate playback speed breakdown.
     */
    private Map<String, SpeedResult> calculateSpeeds(long totalSeconds) {
        Map<String, SpeedResult> speeds = new LinkedHashMap<>();

        for (int i = 0; i < SPEEDS.length; i++) {
            long adjustedSeconds = Math.round(totalSeconds / SPEEDS[i]);
            long timeSavedSeconds = totalSeconds - adjustedSeconds;

            speeds.put(SPEED_LABELS[i], new SpeedResult(
                    adjustedSeconds,
                    formatDuration(adjustedSeconds),
                    formatDuration(timeSavedSeconds)
            ));
        }

        return speeds;
    }

    /**
     * Calculate daily watch plan.
     */
    private DailyPlanResult calculateDailyPlan(long totalSeconds, int minutesPerDay) {
        double totalMinutes = totalSeconds / 60.0;
        int daysNeeded = (int) Math.ceil(totalMinutes / minutesPerDay);

        LocalDate completionDate = LocalDate.now().plusDays(daysNeeded);
        String formattedDate = completionDate.format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));

        return new DailyPlanResult(daysNeeded, formattedDate);
    }

    /**
     * Format seconds into a human-readable duration string.
     */
    public static String formatDuration(long totalSeconds) {
        if (totalSeconds <= 0) return "0s";

        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        StringBuilder sb = new StringBuilder();
        if (hours > 0) sb.append(hours).append("h ");
        if (minutes > 0) sb.append(minutes).append("m ");
        if (seconds > 0 || sb.isEmpty()) sb.append(seconds).append("s");

        return sb.toString().trim();
    }

    /**
     * Save calculation to history.
     */
    private void saveToHistory(List<String> urls, List<PlaylistResult> results, long totalSeconds, int videoCount) {
        try {
            CalculationHistory history = new CalculationHistory();
            history.setInputUrls(String.join(", ", urls));
            history.setPlaylistTitle(results.isEmpty() ? "Unknown" : results.get(0).getPlaylistTitle());
            history.setTotalSeconds(totalSeconds);
            history.setVideoCount(videoCount);
            history.setSpeedData(objectMapper.writeValueAsString(
                    results.isEmpty() ? Map.of() : results.get(0).getSpeeds()
            ));
            historyRepository.save(history);
        } catch (JsonProcessingException e) {
            // Non-critical: log and continue
            System.err.println("Failed to save calculation history: " + e.getMessage());
        }
    }

    /**
     * Get recent calculation history.
     */
    public List<CalculationHistory> getRecentHistory() {
        return historyRepository.findTop20ByOrderByCreatedAtDesc();
    }
}
