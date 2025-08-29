package com.promptoptimizer.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PromptRequest {
    private String prompt;
    private String model;
    private List<String> answers;
    private String optimizedPrompt;
    
    private Integer baseScore;
    private Integer optimizedScore;

    public PromptRequest() {}

}
