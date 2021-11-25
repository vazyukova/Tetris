package com.pi.tetris.tetris.repository;

import com.pi.tetris.tetris.model.Usr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Usr, Integer> {
    Usr findUserByUsername(String username);
}
