package com.pi.tetris.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name="Settings")
public class Settings {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="usr")
    private Usr user;

    @Column(name = "grid")
    int grid;

    @Column(name = "next")
    int next;

    @Column(name = "stat")
    int stat;
}
