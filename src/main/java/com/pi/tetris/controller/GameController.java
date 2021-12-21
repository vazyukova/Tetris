package com.pi.tetris.controller;

import com.pi.tetris.model.Level;
import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import com.pi.tetris.service.LevelService;
import com.pi.tetris.service.StatisticService;
import com.pi.tetris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Controller
public class GameController {
    private final StatisticService statisticService;
    private final UserService userService;
    private final LevelService levelService;

    private static final String SUCCESS_STATUS = "success";
    private static final String ERROR_STATUS = "error";
    private static final int CODE_SUCCESS = 100;
    private static final int AUTH_FAILURE = 102;

    @Autowired
    public GameController(StatisticService statisticService, UserService userService,
                          LevelService levelService) {
        this.statisticService = statisticService;
        this.userService = userService;
        this.levelService = levelService;
    }

    @GetMapping("/game/{id}")
    public String getGlassesInLevel(@PathVariable(name = "id") int levelId, Model model){
        Level level = levelService.getById(levelId).get();
        model.addAttribute("level", level);
        model.addAttribute("glassId", levelService.getById(levelId).get().getGlass().getId());
        return "game";
    }
}
