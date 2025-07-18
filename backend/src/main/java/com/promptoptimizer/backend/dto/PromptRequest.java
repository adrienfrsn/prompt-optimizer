package com.promptoptimizer.backend.dto;

import java.util.List;

public class PromptRequest {
    private String prompt;
    private String model;
    private List<String> answers;

    public PromptRequest() {}

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
}
