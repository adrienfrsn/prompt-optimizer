package com.promptoptimizer.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "prompt_history")
@Data
public class PromptHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @Column(columnDefinition = "TEXT")
    private String originalPrompt;

    private String modelUsed;

    @Column(columnDefinition = "TEXT")
    private String optimizedPrompt;

    private LocalDateTime timestamp;

    public PromptHistory() {}

    public PromptHistory(User user, String originalPrompt, String modelUsed, String optimizedPrompt) {
        this.user = user;
        this.originalPrompt = originalPrompt;
        this.modelUsed = modelUsed;
        this.optimizedPrompt = optimizedPrompt;
        this.timestamp = LocalDateTime.now();
    }
}
