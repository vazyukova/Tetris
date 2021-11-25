package com.pi.tetris.tetris.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    @GetMapping("/main")
    public String getRegistrationPage()
    {
        return "main";
    }

    @GetMapping("/game")
    public String getGamePage(){
        return "game";
    }
}
