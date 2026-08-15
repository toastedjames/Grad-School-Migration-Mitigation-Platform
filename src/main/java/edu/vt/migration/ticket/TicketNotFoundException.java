package edu.vt.migration.ticket;

public class TicketNotFoundException
        extends RuntimeException {

    public TicketNotFoundException(Long id) {

        super("Ticket not found: " + id);
    }
}