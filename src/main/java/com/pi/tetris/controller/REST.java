package com.pi.tetris.controller;

import com.pi.tetris.model.*;
import com.pi.tetris.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class REST {
    
    private final FigureService figureService;
    private final LevelService levelService;
    private final GlassService glassService;
    private final UserService userService;
    private final StatisticService statisticService;
    private final SettingsService settingsService;

    public REST(FigureService figureService, LevelService levelService, GlassService glassService,
                UserService userService, StatisticService statisticService, SettingsService settingsService) {
        this.figureService = figureService;
        this.levelService = levelService;
        this.glassService = glassService;
        this.userService = userService;
        this.statisticService = statisticService;
        this.settingsService = settingsService;
    }

    @GetMapping(value = "/figures", consumes = "application/json", produces = "application/json")
    public ResponseEntity<List<Figure>> getFigures() {
        List<Figure> figures = figureService.findAll();
        if (figures == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(figures, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/saveFigure", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Figure> saveResults(@RequestBody Figure figure) {
        figure.setLevel(figure.getLevel() == null ? levelService.getById(0).get() : figure.getLevel());
        Figure figureSaved = figureService.save(figure);
        if (figureSaved == null){
            return ResponseEntity.status(422).build();
        }
        else if (figureSaved.getMatrix() == null){
            return ResponseEntity.status(400).build();
        }
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .buildAndExpand(figureSaved.getId())
                    .toUri();
        return ResponseEntity.created(uri)
                    .body(figureSaved);
    }

    @PostMapping("/saveSettings/{username}")
    public ResponseEntity<Settings> registration(@PathVariable(name="username") String username, @RequestBody Settings settings)
    {
        Usr userFromDb = userService.findByUsername(username);
        settings.setUser(userFromDb);
        Settings savedSettings = settingsService.save(settings);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .buildAndExpand(savedSettings.getId())
                .toUri();
        return ResponseEntity.created(uri)
                .body(savedSettings);
    }

    @GetMapping(value = "/deleteFigure/{id}")
    public ResponseEntity<List<Figure>> deleteFigure(@PathVariable(name = "id") int id) {
        figureService.remove(figureService.findById(id));
        List<Figure> figures = figureService.findAll();
        if (figures == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(figures, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/getMyStatistic/ByResult")
    public ResponseEntity<List<Statistic>> getMyStatisticByResult() {
        User appUser = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usr user = userService.findByUsername(appUser.getUsername());
        List<Statistic> myStatistics = statisticService.findByUserOrderByResult(user);
        if (myStatistics == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(myStatistics, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/getMyStatistic/ByTime")
    public ResponseEntity<List<Statistic>> getMyStatisticByTime() {
        User appUser = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usr user = userService.findByUsername(appUser.getUsername());
        List<Statistic> myStatistics = statisticService.findByUserOrderByTime(user);
        if (myStatistics == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(myStatistics, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/getBestStatistic/ByResult")
    public ResponseEntity<List<Statistic>> getBestStatisticByResult() {
        List<Statistic> myStatistics = statisticService.findBestByResult();
        if (myStatistics == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(myStatistics, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/getBestStatistic/ByTime")
    public ResponseEntity<List<Statistic>> getBestStatisticByTime() {
        List<Statistic> myStatistics = statisticService.findBestByTime();
        if (myStatistics == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(myStatistics, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/figures/{levelId}")
    public ResponseEntity<List<Figure>> getFiguresByLevel(@PathVariable(name = "levelId") int levelId){
        Level level = levelService.getById(levelId).get();
        List<Figure> figures = figureService.findByLevel(level);
        if (levelId == 0){
            List<Integer> tetraminosIds = new ArrayList<>();
            tetraminosIds.add(55);
            tetraminosIds.add(56);
            tetraminosIds.add(57);
            tetraminosIds.add(58);
            tetraminosIds.add(59);
            tetraminosIds.add(60);
            tetraminosIds.add(61);
            tetraminosIds.add(62);
            tetraminosIds.add(63);
            figures = figures.stream()
                    .filter(fig -> tetraminosIds.contains(fig.getId()))
                    .collect(Collectors.toList());
        }
        if (figures == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<>(figures, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/setGlass/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Level> saveLevel(@PathVariable(name = "id") int id, @RequestBody int glassId) {
        Level level = levelService.getById(id).get();
        Glass glass1 = glassService.getById(glassId).get();
        level.setGlass(glass1);
        Level savedLevel = levelService.save(level);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .buildAndExpand(savedLevel.getId())
                .toUri();
        return ResponseEntity.created(uri)
                .body(savedLevel);
    }

    @PostMapping(value = "/setFigureLevel/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Figure> setFigureLevel(@PathVariable(name = "id") int id, @RequestBody int levelId) {
        Level level = levelService.getById(levelId).get();
        Figure figure = figureService.findById(id);
        figure.setLevel(level);
        figure.setId(id);
        Figure savedFigure = figureService.edit(figure);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .buildAndExpand(savedFigure.getId())
                .toUri();
        return ResponseEntity.created(uri)
                .body(savedFigure);
    }

    @PostMapping(value = "/saveResults", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Statistic> saveResults(@RequestBody Statistic statistic) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Usr usr = userService.findByUsername(user.getUsername());
        statistic.setUser(usr);
        statistic.setTime(Integer.parseInt(statistic.getTime()) / 60000 + ":" + (Integer.parseInt(statistic.getTime()) % 60000) / 1000);
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

    @PostMapping(value = "/saveLevel/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Level> saveLevel(@PathVariable(name="id") int id, @RequestBody double speed) {
        Level level = levelService.getById(id).get();
        level.setSpeed(speed);
        Level savedLevel = levelService.save(level);
        if (savedLevel == null) {
            return ResponseEntity.notFound().build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .buildAndExpand(savedLevel.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(savedLevel);
        }
    }

    @PostMapping(value = "/saveGlass", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Glass> saveGlass(@RequestBody Glass glass) {
        Glass savedGlass = glassService.save(glass);
        if (savedGlass == null) {
            return ResponseEntity.status(422).build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .buildAndExpand(savedGlass.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(savedGlass);
        }
    }

    @PostMapping(value = "/editGlass/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Glass> editGlass(@PathVariable int id, @RequestBody Glass glass) {
        glass.setId(id);
        Glass savedGlass = glassService.save(glass);
        if (savedGlass == null) {
            return ResponseEntity.status(422).build();
        } else {
            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                    .buildAndExpand(savedGlass.getId())
                    .toUri();

            return ResponseEntity.created(uri)
                    .body(savedGlass);
        }
    }

    @GetMapping(value = "/getFigure/{id}")
    public ResponseEntity<Figure> getFigure(@PathVariable(name = "id") int id){
        Figure figure = figureService.findById(id);
        if (figure == null) {
            return ResponseEntity.notFound().build();
        } else {
            return new ResponseEntity<Figure>(figure, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/editFigure/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Figure> saveResults(@PathVariable(name = "id") int id, @RequestBody Figure figure) {
        figure.setId(id);
        Figure figureSaved = figureService.save(figure);
        if (figureSaved == null){
            return ResponseEntity.status(422).build();
        }
        else if (figureSaved.getMatrix() == null){
            return ResponseEntity.status(400).build();
        }
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .buildAndExpand(figureSaved.getId())
                .toUri();
        return ResponseEntity.created(uri)
                .body(figureSaved);
    }
}
