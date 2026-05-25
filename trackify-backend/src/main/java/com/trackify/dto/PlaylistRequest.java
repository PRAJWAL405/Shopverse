package com.trackify.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class PlaylistRequest {

    @NotEmpty(message = "At least one URL is required")
    private List<String> urls;

    private Integer startIndex;
    private Integer endIndex;
    private Integer minutesPerDay;

    public PlaylistRequest() {}

    public PlaylistRequest(List<String> urls, Integer startIndex, Integer endIndex, Integer minutesPerDay) {
        this.urls = urls;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.minutesPerDay = minutesPerDay;
    }

    public List<String> getUrls() { return urls; }
    public void setUrls(List<String> urls) { this.urls = urls; }

    public Integer getStartIndex() { return startIndex; }
    public void setStartIndex(Integer startIndex) { this.startIndex = startIndex; }

    public Integer getEndIndex() { return endIndex; }
    public void setEndIndex(Integer endIndex) { this.endIndex = endIndex; }

    public Integer getMinutesPerDay() { return minutesPerDay; }
    public void setMinutesPerDay(Integer minutesPerDay) { this.minutesPerDay = minutesPerDay; }
}
