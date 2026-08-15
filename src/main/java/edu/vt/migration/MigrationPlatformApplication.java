package edu.vt.migration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MigrationPlatformApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                MigrationPlatformApplication.class,
                args
        );
    }
}