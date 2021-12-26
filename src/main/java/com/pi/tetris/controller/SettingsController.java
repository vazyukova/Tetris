package com.pi.tetris.controller;

import com.pi.tetris.model.Role;
import com.pi.tetris.model.Settings;
import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import com.pi.tetris.service.SettingsService;
import com.pi.tetris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.List;

@Controller
public class SettingsController {
    final SettingsService settingsService;
    final UserService userService;

    public SettingsController(SettingsService settingsService, UserService userService) {
        this.settingsService = settingsService;
        this.userService = userService;
    }

    @GetMapping("/settings")
    public String getSettingsPage(Model model)
    {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("username", user.getUsername());
        Usr usr = userService.findByUsername(user.getUsername());
        Settings settings = settingsService.findByUser(usr);
        if(settings == null)
        {
            settings = new Settings();
            settings.setGrid(1);
            settings.setNext(1);
            settings.setUser(usr);
            settings.setStat(0);
        }
        model.addAttribute("settings", settings);
        return "settings";
    }

}
