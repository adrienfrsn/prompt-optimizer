package com.promptoptimizer.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptoptimizer.backend.dto.PromptResponse;
import com.promptoptimizer.backend.model.PromptHistory;
import com.promptoptimizer.backend.model.User;
import com.promptoptimizer.backend.repository.UserRepository;
import com.promptoptimizer.backend.repository.PromptHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String apiModel;

    @Value("${openai.api.maxTokens}")
    private int apiMaxTokens;

    @Autowired
    private PromptHistoryRepository promptHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    private final static Logger log = LoggerFactory.getLogger(OpenAIService.class);

    public PromptResponse improvePrompt(String prompt, String model) {
        String systemPrompt = """
                    You are an expert in prompt engineering.

                    1. Analyze the user's prompt.

                    2. If the prompt is clear and includes at least the following information: objective, context, target, and specific constraints, then improve it and respond **only** in JSON format:
                    {
                      "optimizedPrompt": "the improved prompt"
                    }

                    3. If the prompt is too vague, incomplete, or lacks key information (e.g., no clear objective, no context, no constraints), then respond **only** in JSON format with questions to ask the user for clarification:
                    {
                      "questions": ["question 1", "question 2", "..."]
                    }

                    4. You must choose **only one** of the two cases — never both.

                    5. Never respond with anything other than this JSON.

                    6. Examples:

                    Input: "Workout plan"
                    Output: {"questions": ["For what fitness level?", "How many days per week?", "With what equipment?"]}

                    Input: "Advanced 3-day workout plan with dumbbells"
                    Output: {"optimizedPrompt": "Create an advanced 3-day strength training program using dumbbells, including exercises, sets, and reps."}
                """;

        String userPrompt = "Here is a user prompt to improve for the model " + model + ": " + prompt;

        String url = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> map = Map.of(
                "model", apiModel,
                "messages", new Object[] {
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                },
                "max_tokens", apiMaxTokens);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(map, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);
            String jsonResponse = ((Map) ((Map) ((List) response.getBody().get("choices")).get(0)).get("message"))
                    .get("content").toString().trim();

            ObjectMapper objectMapper = new ObjectMapper();

            PromptResponse promptResponse;
            try {
                promptResponse = objectMapper.readValue(jsonResponse, PromptResponse.class);
                savePromptHistory(prompt, model, promptResponse);
            } catch (Exception e) {
                e.printStackTrace();
                promptResponse = new PromptResponse();
            }

            return promptResponse;

        } catch (Exception e) {
            e.printStackTrace();
            return new PromptResponse();
        }
    }

    private void savePromptHistory(String originalPrompt, String model, PromptResponse promptResponse) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                String username = authentication.getName();
                User user = userRepository.findByUsername(username);

                if (user != null) {
                    String responseToSave = "";
                    if (promptResponse.getOptimizedPrompt() != null) {
                        responseToSave = promptResponse.getOptimizedPrompt();
                    } else if (promptResponse.getQuestions() != null) {
                        responseToSave = String.join(", ", promptResponse.getQuestions());
                    }

                    PromptHistory history = new PromptHistory(user, originalPrompt, model, responseToSave);
                    promptHistoryRepository.save(history);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<PromptHistory> getUserPromptHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            log.info("username: " + username);
            User user = userRepository.findByUsername(username);

            if (user != null) {
                return promptHistoryRepository.findByUserOrderByTimestampDesc(user);
            }
        }
        return List.of();
    }
}
