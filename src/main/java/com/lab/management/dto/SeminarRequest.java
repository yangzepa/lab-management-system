package com.lab.management.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SeminarRequest {
    private String title;
    private String content;
    private Long presenterId;
    private LocalDateTime seminarDate;
    private String location;
    private String topic;
    private Boolean isPublic = true;
    private String attachmentUrl;
}
