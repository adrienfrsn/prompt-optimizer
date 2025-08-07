package com.promptoptimizer.backend.controller;

import com.promptoptimizer.backend.dto.PromptRequest;
import com.promptoptimizer.backend.dto.PromptResponse;
import com.promptoptimizer.backend.model.PromptHistory;
import com.promptoptimizer.backend.service.OpenAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompt")
@CrossOrigin(origins = "http://localhost:5173")
public class PromptController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/improve")
    public PromptResponse improvePrompt(@RequestBody PromptRequest request) {
        if (request.getPrompt() == null || request.getPrompt().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be null or empty");
        }
        if (request.getModel() == null || request.getModel().isEmpty()) {
            throw new IllegalArgumentException("Model cannot be null or empty");
        }
        return openAIService.improvePrompt(request.getPrompt(), request.getModel());
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPromptHistory() {
        List<PromptHistory> history = openAIService.getUserPromptHistory();
        return ResponseEntity.ok(history);
    }
}
