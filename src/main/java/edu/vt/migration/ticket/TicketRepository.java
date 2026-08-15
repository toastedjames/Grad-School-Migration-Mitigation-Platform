package edu.vt.migration.ticket;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository
        extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatusIgnoreCase(
            String status
    );

    List<Ticket> findByCategoryIgnoreCase(
            String category
    );
}