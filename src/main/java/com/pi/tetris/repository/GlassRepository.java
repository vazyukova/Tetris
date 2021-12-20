package com.pi.tetris.repository;

import com.pi.tetris.model.Glass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlassRepository extends JpaRepository<Glass, Integer> {
}
