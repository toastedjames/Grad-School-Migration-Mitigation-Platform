package edu.vt.migration.config;

import edu.vt.migration.ticket.Ticket;
import edu.vt.migration.ticket.TicketRepository;

import org.springframework.boot.CommandLineRunner;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class DataInitializer {


    @Bean
    CommandLineRunner initializeDatabase(
            TicketRepository repository) {


        return args -> {


            if (repository.count() == 0) {


                repository.save(

                    new Ticket(

                        "AWS migration test",

                        "Validate application after deployment " +
                        "to the target environment.",

                        "OPEN",

                        "Infrastructure"
                    )
                );


                repository.save(

                    new Ticket(

                        "Database connectivity",

                        "Verify PostgreSQL connectivity " +
                        "and environment configuration.",

                        "IN_PROGRESS",

                        "Database"
                    )
                );


                repository.save(

                    new Ticket(

                        "Application health check",

                        "Verify application health endpoint " +
                        "after deployment.",

                        "OPEN",

                        "Application"
                    )
                );
            }
        };
    }
}