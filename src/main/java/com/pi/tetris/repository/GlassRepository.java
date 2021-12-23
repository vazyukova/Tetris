package com.pi.tetris.repository;

import com.pi.tetris.model.Glass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlassRepository extends JpaRepository<Glass, Integer> {
    List<Glass> findByHeightAndWidth(int height, int width);
}
