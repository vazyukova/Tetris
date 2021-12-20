package com.pi.tetris.service;

import com.pi.tetris.model.Glass;
import com.pi.tetris.model.Level;
import com.pi.tetris.repository.LevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LevelService {
    final LevelRepository levelRepository;

    public LevelService(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    public Optional<Level> getById(int id){
        return levelRepository.findById(id);
    }

    public Level save(Level level){
        return levelRepository.save(level);
    }
}
