package com.pi.tetris.model;

import lombok.Data;
import org.springframework.boot.convert.DataSizeUnit;

import javax.persistence.*;

@Data
@Entity
@Table(name="level")
public class Level {
    @Id
    int id;

    @OneToOne
    @JoinColumn(name = "glass_id", referencedColumnName = "id")
    Glass glass;

    @Column(name="speed")
    double speed;
}
