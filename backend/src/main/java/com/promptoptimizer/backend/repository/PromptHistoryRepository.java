package com.promptoptimizer.backend.repository;

import com.promptoptimizer.backend.model.PromptHistory;
import com.promptoptimizer.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromptHistoryRepository extends JpaRepository<PromptHistory, Long> {
    List<PromptHistory> findByUserOrderByTimestampDesc(User user);
}
