package com.pi.tetris.service;

import com.pi.tetris.model.Settings;
import com.pi.tetris.model.Usr;
import com.pi.tetris.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SettingsService {
    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public Settings findByUser(Usr user){
        return settingsRepository.findByUser(user);
    }

    public Settings save(Settings settings){
        return settingsRepository.save(settings);
    }
}
