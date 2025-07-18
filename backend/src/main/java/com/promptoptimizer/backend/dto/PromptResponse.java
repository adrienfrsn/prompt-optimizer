package com.promptoptimizer.backend.dto;

import java.util.List;

public class PromptResponse {

    private String optimizedPrompt;
    private List<String> questions;

    public PromptResponse() {}

    public String getOptimizedPrompt() {
        return optimizedPrompt;
    }

    public void setOptimizedPrompt(String optimizedPrompt) {
        this.optimizedPrompt = optimizedPrompt;
    }

    public List<String> getQuestions() {
        return questions;
    }

    public void setQuestions(List<String> questions) {
        this.questions = questions;
    }
}
