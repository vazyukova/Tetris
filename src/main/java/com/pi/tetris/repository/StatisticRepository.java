package com.pi.tetris.repository;

import com.pi.tetris.model.Statistic;
import com.pi.tetris.model.Usr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatisticRepository extends JpaRepository<Statistic, Integer> {
    List<Statistic> findByUserOrderByResultDesc(Usr user);
    List<Statistic> findByUserOrderByTime(Usr user);
    List<Statistic> findFirst10ByOrderByResultDesc();
    List<Statistic> findFirst10ByOrderByTime();
}
