package com.pi.tetris.controller;

import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import com.pi.tetris.service.StatisticService;
import com.pi.tetris.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/game-api")
public class GameController {
    private final StatisticService statisticService;
    private final UserService userService;

    private static final String SUCCESS_STATUS = "success";
    private static final String ERROR_STATUS = "error";
    private static final int CODE_SUCCESS = 100;
    private static final int AUTH_FAILURE = 102;

    @Autowired
    public GameController(StatisticService statisticService, UserService userService) {
        this.statisticService = statisticService;
        this.userService = userService;
    }

    @PostMapping(value = "/saveResults", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Statistic> saveResults(@RequestBody Statistic statistic) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usr usr = userService.findByUsername(user.getUsername());
        statistic.setUser(usr);
        statistic.setTime(Integer.parseInt(statistic.getTime()) / 60000 + ":" + Integer.parseInt(statistic.getTime()) % 60000);
        Statistic saveStatistic = statisticService.save(statistic);
        if (saveStatistic == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .buildAndExpand(saveStatistic.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(saveStatistic);
        }
    }
}
