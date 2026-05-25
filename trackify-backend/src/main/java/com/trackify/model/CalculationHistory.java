package com.trackify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calculation_history")
public class CalculationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "input_urls", columnDefinition = "TEXT")
    private String inputUrls;

    @Column(name = "playlist_title", length = 500)
    private String playlistTitle;

    @Column(name = "total_seconds")
    private Long totalSeconds;

    @Column(name = "video_count")
    private Integer videoCount;

    @Column(name = "speed_data", columnDefinition = "JSON")
    private String speedData;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    public CalculationHistory() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInputUrls() { return inputUrls; }
    public void setInputUrls(String inputUrls) { this.inputUrls = inputUrls; }

    public String getPlaylistTitle() { return playlistTitle; }
    public void setPlaylistTitle(String playlistTitle) { this.playlistTitle = playlistTitle; }

    public Long getTotalSeconds() { return totalSeconds; }
    public void setTotalSeconds(Long totalSeconds) { this.totalSeconds = totalSeconds; }

    public Integer getVideoCount() { return videoCount; }
    public void setVideoCount(Integer videoCount) { this.videoCount = videoCount; }

    public String getSpeedData() { return speedData; }
    public void setSpeedData(String speedData) { this.speedData = speedData; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
