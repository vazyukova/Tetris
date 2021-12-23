package com.pi.tetris.controller;

import com.pi.tetris.model.Figure;
import com.pi.tetris.model.Glass;
import com.pi.tetris.service.FigureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class FiguresController {
    private final FigureService figureService;

    public FiguresController(FigureService figureService) {
        this.figureService = figureService;
    }

    @GetMapping("/editFigure/{id}")
    public String editGlassView(@PathVariable(name = "id") int id, Model model){
        Figure editFigure = figureService.findById(id);
        model.addAttribute("figureId", editFigure.getId());
        return "edit-figure";
    }
}
