package com.pi.tetris.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="Statistic")
public class Statistic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="usr")
    private Usr user;

    @Column(name = "time")
    private String time;
    @Column(name = "result")
    private int result;
}
