package com.pi.tetris.controller;

import com.pi.tetris.model.Statistic;
import com.pi.tetris.service.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class StatisticController {
    final StatisticService statisticService;

    public StatisticController(StatisticService statisticService) {
        this.statisticService = statisticService;
    }

    @GetMapping("/statistic")
    public String getRegistrationPage(Model model)
    {
        List<Statistic> statistics = statisticService.findAll();
        model.addAttribute("statistics", statistics);
        return "statistic";
    }
}
