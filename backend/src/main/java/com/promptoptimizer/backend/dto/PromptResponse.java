package com.promptoptimizer.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class PromptResponse {

    private String optimizedPrompt;
    private String modelUsed;
    private Integer baseScore;
    private Integer optimizedScore;
    private List<String> questions;
    private LocalDateTime timestamp;

    public PromptResponse() {}

}
