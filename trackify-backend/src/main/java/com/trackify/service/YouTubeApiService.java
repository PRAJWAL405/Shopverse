package com.trackify.service;

import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.*;
import com.trackify.exception.InvalidUrlException;
import com.trackify.exception.PlaylistNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class YouTubeApiService {

    private final YouTube youTube;
    private final String apiKey;

    // Regex patterns for YouTube URL parsing
    private static final Pattern PLAYLIST_URL_PATTERN = Pattern.compile(
            "(?:https?://)?(?:www\\.)?(?:youtube\\.com|music\\.youtube\\.com)/playlist\\?list=([a-zA-Z0-9_-]+)"
    );
    private static final Pattern VIDEO_URL_WITH_LIST_PATTERN = Pattern.compile(
            "(?:https?://)?(?:www\\.)?youtube\\.com/watch\\?.*list=([a-zA-Z0-9_-]+)"
    );
    private static final Pattern VIDEO_URL_PATTERN = Pattern.compile(
            "(?:https?://)?(?:www\\.)?youtube\\.com/watch\\?v=([a-zA-Z0-9_-]+)"
    );
    private static final Pattern SHORT_URL_PATTERN = Pattern.compile(
            "(?:https?://)?youtu\\.be/([a-zA-Z0-9_-]+)"
    );
    private static final Pattern RAW_PLAYLIST_ID_PATTERN = Pattern.compile(
            "^(PL[a-zA-Z0-9_-]+|UU[a-zA-Z0-9_-]+|OL[a-zA-Z0-9_-]+|FL[a-zA-Z0-9_-]+|RD[a-zA-Z0-9_-]*)$"
    );

    public YouTubeApiService(YouTube youTube, @Qualifier("youtubeApiKey") String apiKey) {
        this.youTube = youTube;
        this.apiKey = apiKey;
    }

    /**
     * Extract playlist ID from various YouTube URL formats.
     */
    public String extractPlaylistId(String input) {
        if (input == null || input.isBlank()) {
            throw new InvalidUrlException("URL cannot be empty");
        }

        input = input.trim();

        // Check playlist URL
        Matcher matcher = PLAYLIST_URL_PATTERN.matcher(input);
        if (matcher.find()) return matcher.group(1);

        // Check video URL with list parameter
        matcher = VIDEO_URL_WITH_LIST_PATTERN.matcher(input);
        if (matcher.find()) return matcher.group(1);

        // Check raw playlist ID
        matcher = RAW_PLAYLIST_ID_PATTERN.matcher(input);
        if (matcher.find()) return matcher.group(1);

        throw new InvalidUrlException("Could not extract a playlist ID from: " + input);
    }

    /**
     * Check if input is a single video URL (not a playlist).
     */
    public boolean isSingleVideoUrl(String input) {
        input = input.trim();
        // Has a video ID but no list parameter
        if (VIDEO_URL_PATTERN.matcher(input).find() && !VIDEO_URL_WITH_LIST_PATTERN.matcher(input).find()) {
            return true;
        }
        return SHORT_URL_PATTERN.matcher(input).find() && !input.contains("list=");
    }

    /**
     * Extract video ID from a single video URL.
     */
    public String extractVideoId(String input) {
        input = input.trim();
        Matcher matcher = VIDEO_URL_PATTERN.matcher(input);
        if (matcher.find()) return matcher.group(1);

        matcher = SHORT_URL_PATTERN.matcher(input);
        if (matcher.find()) return matcher.group(1);

        throw new InvalidUrlException("Could not extract a video ID from: " + input);
    }

    /**
     * Fetch all video IDs from a playlist (handles pagination).
     */
    public List<String> fetchPlaylistVideoIds(String playlistId) throws IOException {
        List<String> videoIds = new ArrayList<>();
        String nextPageToken = null;

        do {
            PlaylistItemListResponse response = youTube.playlistItems()
                    .list(List.of("contentDetails"))
                    .setPlaylistId(playlistId)
                    .setPageToken(nextPageToken)
                    .setMaxResults(50L)
                    .setKey(apiKey)
                    .execute();

            if (response.getItems() == null || response.getItems().isEmpty()) {
                if (videoIds.isEmpty()) {
                    throw new PlaylistNotFoundException(
                            "Playlist not found or is empty. It may be private or deleted. ID: " + playlistId
                    );
                }
                break;
            }

            for (PlaylistItem item : response.getItems()) {
                videoIds.add(item.getContentDetails().getVideoId());
            }
            nextPageToken = response.getNextPageToken();
        } while (nextPageToken != null);

        return videoIds;
    }

    /**
     * Fetch the title of a playlist.
     */
    public String fetchPlaylistTitle(String playlistId) throws IOException {
        PlaylistListResponse response = youTube.playlists()
                .list(List.of("snippet"))
                .setId(List.of(playlistId))
                .setKey(apiKey)
                .execute();

        if (response.getItems() != null && !response.getItems().isEmpty()) {
            return response.getItems().get(0).getSnippet().getTitle();
        }
        return "Unknown Playlist";
    }

    /**
     * Fetch durations for a list of video IDs (batches of 50).
     * Returns list of durations in seconds.
     */
    public List<Long> fetchVideoDurations(List<String> videoIds) throws IOException {
        List<Long> durations = new ArrayList<>();

        for (int i = 0; i < videoIds.size(); i += 50) {
            List<String> batch = videoIds.subList(i, Math.min(i + 50, videoIds.size()));

            VideoListResponse response = youTube.videos()
                    .list(List.of("contentDetails"))
                    .setId(batch)
                    .setKey(apiKey)
                    .execute();

            if (response.getItems() != null) {
                for (Video video : response.getItems()) {
                    String isoDuration = video.getContentDetails().getDuration();
                    try {
                        Duration d = Duration.parse(isoDuration);
                        durations.add(d.getSeconds());
                    } catch (Exception e) {
                        // Skip videos with unparseable durations (e.g., live streams)
                        durations.add(0L);
                    }
                }
            }
        }

        return durations;
    }

    /**
     * Fetch the duration of a single video.
     */
    public long fetchSingleVideoDuration(String videoId) throws IOException {
        VideoListResponse response = youTube.videos()
                .list(List.of("contentDetails", "snippet"))
                .setId(List.of(videoId))
                .setKey(apiKey)
                .execute();

        if (response.getItems() != null && !response.getItems().isEmpty()) {
            String isoDuration = response.getItems().get(0).getContentDetails().getDuration();
            return Duration.parse(isoDuration).getSeconds();
        }
        throw new PlaylistNotFoundException("Video not found: " + videoId);
    }

    /**
     * Fetch the title of a single video.
     */
    public String fetchVideoTitle(String videoId) throws IOException {
        VideoListResponse response = youTube.videos()
                .list(List.of("snippet"))
                .setId(List.of(videoId))
                .setKey(apiKey)
                .execute();

        if (response.getItems() != null && !response.getItems().isEmpty()) {
            return response.getItems().get(0).getSnippet().getTitle();
        }
        return "Unknown Video";
    }
}
