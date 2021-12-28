package com.pi.tetris.repository;

import com.pi.tetris.model.Figure;
import com.pi.tetris.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FigureRepository extends JpaRepository<Figure, Integer> {
    List<Figure> findAllByOrderByLevel();
    List<Figure> findByMatrix(String matrix);
    Figure findById(int id);
    List<Figure> findByLevel(Level level);
}
