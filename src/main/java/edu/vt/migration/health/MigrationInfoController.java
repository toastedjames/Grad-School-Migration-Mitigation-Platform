package edu.vt.migration.health;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

import java.util.Map;


@RestController
public class MigrationInfoController {


    @Value("${app.environment:local}")
    private String environment;


    @GetMapping("/api/migration-info")
    public Map<String, Object> migrationInfo() {


        return Map.of(

            "application",
            "Graduate School Migration Platform",

            "environment",
            environment,

            "timestamp",
            Instant.now().toString(),

            "javaVersion",
            System.getProperty("java.version"),

            "host",
            System.getenv()
                .getOrDefault(
                    "HOSTNAME",
                    "local-machine"
                )
        );
    }
}