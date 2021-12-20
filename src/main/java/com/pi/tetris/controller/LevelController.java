package com.pi.tetris.controller;

import com.pi.tetris.model.Figure;
import com.pi.tetris.model.Level;
import com.pi.tetris.service.FigureService;
import com.pi.tetris.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class LevelController {
    final LevelService levelService;
    final FigureService figureService;

    public LevelController(LevelService levelService, FigureService figureService) {
        this.levelService = levelService;
        this.figureService = figureService;
    }


    @GetMapping("/level/{id}")
    public String getLevelPage(@PathVariable int id, Model model){
        Level level = levelService.getById(id).get();
        model.addAttribute("level", level);
        model.addAttribute("glass", level.getGlass());
        return "level";
    }

    @GetMapping("/figs-in-level/{id}")
    public String getGlassesInLevel(@PathVariable(name = "id") int levelId, Model model){
        model.addAttribute("levelId", levelId);
        return "figures-in-level";
    }
}
