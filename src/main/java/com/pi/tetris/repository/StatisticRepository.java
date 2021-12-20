package com.pi.tetris.repository;

import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Integer> {
    Statistic findByUser(Usr user);

}
