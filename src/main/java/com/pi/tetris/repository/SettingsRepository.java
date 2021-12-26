package com.pi.tetris.repository;

import com.pi.tetris.model.Settings;
import com.pi.tetris.model.Usr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Integer> {
    Settings findByUser(Usr user);
}
