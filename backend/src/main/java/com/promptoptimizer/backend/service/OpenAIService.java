package com.promptoptimizer.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptoptimizer.backend.dto.PromptResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    public PromptResponse improvePrompt(String prompt, String model) {
        String systemPrompt = """
                            Tu es un expert en prompt engineering.

                            1. Analyse le prompt utilisateur.

                            2. Si le prompt est clair et contient au moins ces informations : objectif, contexte, cible, contraintes précises, alors améliore-le et réponds uniquement par JSON :
                            {
                              "optimizedPrompt": "le prompt amélioré"
                            }

                            3. Si le prompt est trop vague, incomplet, ou manque d’informations clés (par exemple, pas d’objectif clair, pas de contexte, pas de contraintes), alors réponds uniquement par JSON avec des questions à poser à l’utilisateur pour clarifier :
                            {
                              "questions": ["question 1", "question 2", "..."]
                            }

                            4. Tu dois impérativement choisir l’un des deux cas, jamais les deux.

                            5. Ne réponds jamais avec du texte autre que ce JSON.

                            6. Exemples :

                            Input : "Programme d'entraînement" \s
                            Output : {"questions": ["Pour quel niveau ?", "Combien de jours par semaine ?", "Avec quels équipements ?"]}

                            Input : "Programme d'entraînement avancé 3 jours avec haltères" \s
                            Output : {"optimizedPrompt": "Élabore un programme d'entraînement musculaire avancé sur 3 jours avec haltères en précisant les exercices, séries et répétitions."}

                """;

        String userPrompt = "Voici un prompt utilisateur à améliorer pour le modèle " + model + " : " + prompt;

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

}
