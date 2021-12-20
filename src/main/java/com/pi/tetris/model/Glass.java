package com.pi.tetris.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="glass")
public class Glass {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name="width")
    int width;

    @Column(name="height")
    int height;
}
