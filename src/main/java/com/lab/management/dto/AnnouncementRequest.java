package com.lab.management.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {
    private String title;
    private String content;
    private Boolean isImportant = false;
    private Boolean isPublic = true;
}
