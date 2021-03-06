package com.pi.tetris.service;

import com.pi.tetris.model.Glass;
import com.pi.tetris.repository.GlassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GlassService {
    final GlassRepository glassRepository;

    public GlassService(GlassRepository glassRepository) {
        this.glassRepository = glassRepository;
    }

    public Glass save(Glass glass){
        List<Glass> duplicateGlasses = findByHeightAndWidth(glass.getHeight(), glass.getWidth());
        if (duplicateGlasses.isEmpty()) {
            return glassRepository.save(glass);
        }
        else{
            return null;
        }
    }

    public List<Glass> findAll(){
        return glassRepository.findAll();
    }

    public void remove(Glass glass){
        glassRepository.delete(glass);
    }

    public Optional<Glass> getById(int id){
        return glassRepository.findById(id);
    }

    public List<Glass> findByHeightAndWidth(int height, int width){
        return glassRepository.findByHeightAndWidth(height, width);
    }
}
