package com.pi.tetris.controller;

import com.pi.tetris.model.Glass;
import com.pi.tetris.service.GlassService;
import com.pi.tetris.service.LevelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.Optional;

@Controller
public class GlassesController {
    final GlassService glassService;
    final LevelService levelService;

    public GlassesController(GlassService glassService, LevelService levelService) {
        this.glassService = glassService;
        this.levelService = levelService;
    }

    @GetMapping("/glasses")
    public String getGlasses(Model model){
        List<Glass> glasses = glassService.findAll();
        model.addAttribute("glasses", glasses);
        return "glasses";
    }

    @PostMapping("/saveGlass")
    public String saveGlass(Glass glass){
        glassService.save(glass);
        return "redirect:/glasses";
    }

    @GetMapping("/deleteGlass/{id}")
    public String deleteGlass(@PathVariable(name = "id") int id){
        glassService.remove(glassService.getById(id).get());
        return "redirect:/glasses";
    }

    @GetMapping("/editGlass/{id}")
    public String editGlassView(@PathVariable(name = "id") int id, Model model){
        Glass editGlass = glassService.getById(id).get();
        System.out.println(editGlass.getHeight() + " " + editGlass.getWidth());
        model.addAttribute("editG", editGlass);
        List<Glass> glasses = glassService.findAll();
        model.addAttribute("glasses", glasses);
        return "edit-glass";
    }

    @PostMapping("/editGlass/{id}")
    public String editGlass(@PathVariable(name = "id") int id, Glass glass){
        glass.setId(id);
        glassService.save(glass);
        return "redirect:/glasses";
    }

    @GetMapping("/glass-in-level/{id}")
    public String getGlassesInLevel(@PathVariable(name = "id") int levelId, Model model){
        model.addAttribute("glasses", glassService.findAll());
        model.addAttribute("levelId", levelId);
        model.addAttribute("glassId", levelService.getById(levelId).get().getGlass().getId());
        return "glass-in-level";
    }
}
