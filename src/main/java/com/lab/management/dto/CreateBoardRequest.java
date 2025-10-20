package com.lab.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBoardRequest {
    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

    @NotNull(message = "공개 여부는 필수입니다.")
    private Boolean isPublic;

    private String imageUrl;
    private String attachmentUrl;
    private String attachmentName;
    private String attachments; // JSON 배열로 여러 파일
}
