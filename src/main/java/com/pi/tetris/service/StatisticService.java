package com.pi.tetris.service;

import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import com.pi.tetris.repository.StatisticRepository;
import com.pi.tetris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticService {
    private final StatisticRepository statisticRepository;

    @Autowired
    public StatisticService(StatisticRepository statisticRepository) {
        this.statisticRepository = statisticRepository;
    }

    public Statistic save(Statistic statistic){
        return statisticRepository.save(statistic);
    }

    public List<Statistic> findAll(){
        return statisticRepository.findAll();
    }
}
