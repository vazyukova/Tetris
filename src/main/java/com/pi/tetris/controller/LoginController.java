package com.pi.tetris.controller;

import com.pi.tetris.model.Role;
import com.pi.tetris.model.Usr;
import com.pi.tetris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Collections;

@Controller
public class LoginController {
    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/registration")
    public String getRegistrationPage()
    {
        return "registration";
    }

    @PostMapping("/registration")
    public String registration(Usr user)
    {
        Usr userFromDb = userService.findByUsername(user.getUsername());

        if (userFromDb == null){
            user.setActive(true);
            user.setRoles(Collections.singleton(Role.USER));
            userService.save(user);
        }
        return "redirect:/login";
    }
}
