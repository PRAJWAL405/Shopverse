package com.trackify.dto;

import java.util.List;
import java.util.Map;

public class PlaylistResponse {

    private List<PlaylistResult> playlists;
    private OverallSummary overallSummary;

    public PlaylistResponse() {}

    public PlaylistResponse(List<PlaylistResult> playlists, OverallSummary overallSummary) {
        this.playlists = playlists;
        this.overallSummary = overallSummary;
    }

    public List<PlaylistResult> getPlaylists() { return playlists; }
    public void setPlaylists(List<PlaylistResult> playlists) { this.playlists = playlists; }

    public OverallSummary getOverallSummary() { return overallSummary; }
    public void setOverallSummary(OverallSummary overallSummary) { this.overallSummary = overallSummary; }

    // --- Nested Classes ---

    public static class PlaylistResult {
        private String playlistTitle;
        private String playlistId;
        private int videoCount;
        private long totalSeconds;
        private String formattedDuration;
        private String averageDuration;
        private Map<String, SpeedResult> speeds;
        private DailyPlanResult dailyPlan;

        public PlaylistResult() {}

        public String getPlaylistTitle() { return playlistTitle; }
        public void setPlaylistTitle(String playlistTitle) { this.playlistTitle = playlistTitle; }

        public String getPlaylistId() { return playlistId; }
        public void setPlaylistId(String playlistId) { this.playlistId = playlistId; }

        public int getVideoCount() { return videoCount; }
        public void setVideoCount(int videoCount) { this.videoCount = videoCount; }

        public long getTotalSeconds() { return totalSeconds; }
        public void setTotalSeconds(long totalSeconds) { this.totalSeconds = totalSeconds; }

        public String getFormattedDuration() { return formattedDuration; }
        public void setFormattedDuration(String formattedDuration) { this.formattedDuration = formattedDuration; }

        public String getAverageDuration() { return averageDuration; }
        public void setAverageDuration(String averageDuration) { this.averageDuration = averageDuration; }

        public Map<String, SpeedResult> getSpeeds() { return speeds; }
        public void setSpeeds(Map<String, SpeedResult> speeds) { this.speeds = speeds; }

        public DailyPlanResult getDailyPlan() { return dailyPlan; }
        public void setDailyPlan(DailyPlanResult dailyPlan) { this.dailyPlan = dailyPlan; }
    }

    public static class SpeedResult {
        private long seconds;
        private String formatted;
        private String timeSaved;

        public SpeedResult() {}

        public SpeedResult(long seconds, String formatted, String timeSaved) {
            this.seconds = seconds;
            this.formatted = formatted;
            this.timeSaved = timeSaved;
        }

        public long getSeconds() { return seconds; }
        public void setSeconds(long seconds) { this.seconds = seconds; }

        public String getFormatted() { return formatted; }
        public void setFormatted(String formatted) { this.formatted = formatted; }

        public String getTimeSaved() { return timeSaved; }
        public void setTimeSaved(String timeSaved) { this.timeSaved = timeSaved; }
    }

    public static class DailyPlanResult {
        private int daysNeeded;
        private String completionDate;

        public DailyPlanResult() {}

        public DailyPlanResult(int daysNeeded, String completionDate) {
            this.daysNeeded = daysNeeded;
            this.completionDate = completionDate;
        }

        public int getDaysNeeded() { return daysNeeded; }
        public void setDaysNeeded(int daysNeeded) { this.daysNeeded = daysNeeded; }

        public String getCompletionDate() { return completionDate; }
        public void setCompletionDate(String completionDate) { this.completionDate = completionDate; }
    }

    public static class OverallSummary {
        private int totalPlaylists;
        private int totalVideos;
        private long totalSeconds;
        private String formattedDuration;

        public OverallSummary() {}

        public OverallSummary(int totalPlaylists, int totalVideos, long totalSeconds, String formattedDuration) {
            this.totalPlaylists = totalPlaylists;
            this.totalVideos = totalVideos;
            this.totalSeconds = totalSeconds;
            this.formattedDuration = formattedDuration;
        }

        public int getTotalPlaylists() { return totalPlaylists; }
        public void setTotalPlaylists(int totalPlaylists) { this.totalPlaylists = totalPlaylists; }

        public int getTotalVideos() { return totalVideos; }
        public void setTotalVideos(int totalVideos) { this.totalVideos = totalVideos; }

        public long getTotalSeconds() { return totalSeconds; }
        public void setTotalSeconds(long totalSeconds) { this.totalSeconds = totalSeconds; }

        public String getFormattedDuration() { return formattedDuration; }
        public void setFormattedDuration(String formattedDuration) { this.formattedDuration = formattedDuration; }
    }
}
