package com.pi.tetris.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="figure")
public class Figure {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    int id;

    @Column(name="matrix")
    String matrix;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="level")
    Level level;
}
