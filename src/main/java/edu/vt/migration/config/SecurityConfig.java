package edu.vt.migration.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.core.userdetails.User;

import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import org.springframework.security.web.SecurityFilterChain;


@Configuration
public class SecurityConfig {


    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {


        http

            .csrf(
                csrf -> csrf.disable()
            )

            .authorizeHttpRequests(
                auth -> auth

                    .requestMatchers(
                        "/actuator/health"
                    )
                    .permitAll()

                    .requestMatchers(
                        "/**"
                    )
                    .authenticated()
            )

            .httpBasic(
                basic -> {}
            );


        return http.build();
    }


    @Bean
    InMemoryUserDetailsManager users() {


        var admin = User

                .withUsername("admin")

                .password(
                    "{noop}ChangeMe123!"
                )

                .roles("ADMIN")

                .build();


        return new InMemoryUserDetailsManager(
                admin
        );
    }
}