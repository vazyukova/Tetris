package com.pi.tetris.service;

import com.pi.tetris.model.Figure;
import com.pi.tetris.model.Glass;
import com.pi.tetris.model.Level;
import com.pi.tetris.repository.FigureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FigureService {
    final FigureRepository figureRepository;

    public FigureService(FigureRepository figureRepository) {
        this.figureRepository = figureRepository;
    }

    public List<Figure> findAll(){
        return figureRepository.findAll();
    }

    public List<Figure> findByMatrix(String matrix){
        return figureRepository.findByMatrix(matrix);
    }

    public Figure save(Figure figure){
        return figureRepository.save(figure);
    }

    public Figure findById(int id){
        return figureRepository.findById(id);
    }

    public void remove(Figure figure){
        figureRepository.delete(figure);
    }

    public List<Figure> findByLevel(Level level){
        return figureRepository.findByLevel(level);
    }
}
