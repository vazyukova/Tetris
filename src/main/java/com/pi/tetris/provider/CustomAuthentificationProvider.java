package com.pi.tetris.provider;

import com.pi.tetris.model.Role;
import com.pi.tetris.model.Usr;
import com.pi.tetris.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class CustomAuthentificationProvider implements AuthenticationProvider {
    @Autowired
    UserRepository userRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String userName = authentication.getName();
        String password = authentication.getCredentials().toString();
        //получаем пользователя
        Usr myUser = userRepository.findUserByUsername(userName);
        //смотрим, найден ли пользователь в базе
        if (myUser == null) {
            myUser = new Usr();
            myUser.setUsername(userName);
            myUser.setPassword(password);
            myUser.setActive(true);
            myUser.setRoles(Collections.singleton(Role.USER));
            userRepository.save(myUser);
        }
        if (!password.equals(myUser.getPassword())) {
            throw new BadCredentialsException("Bad password");
        }
        UserDetails principal = User.builder()
                .username(myUser.getUsername())
                .password(myUser.getPassword())
                .authorities(myUser.getRoles())
                .build();
        return new UsernamePasswordAuthenticationToken(
                principal, password, principal.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
