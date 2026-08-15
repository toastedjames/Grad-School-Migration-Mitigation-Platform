package edu.vt.migration.ticket;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {


    private final TicketRepository repository;


    public TicketController(
            TicketRepository repository) {

        this.repository = repository;
    }


    /*
     * GET ALL TICKETS
     */
    @GetMapping
    public List<Ticket> getTickets(

            @RequestParam(
                    required = false
            )
            String status,

            @RequestParam(
                    required = false
            )
            String category) {


        if (status != null) {

            return repository
                    .findByStatusIgnoreCase(status);
        }


        if (category != null) {

            return repository
                    .findByCategoryIgnoreCase(category);
        }


        return repository.findAll();
    }


    /*
     * GET SINGLE TICKET
     */
    @GetMapping("/{id}")
    public Ticket getTicket(
            @PathVariable Long id) {


        return repository
                .findById(id)
                .orElseThrow(
                        () -> new TicketNotFoundException(id)
                );
    }


    /*
     * CREATE TICKET
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ticket createTicket(

            @Valid
            @RequestBody
            Ticket ticket) {


        ticket.setStatus(
                ticket.getStatus().toUpperCase()
        );


        return repository.save(ticket);
    }


    /*
     * UPDATE TICKET
     */
    @PutMapping("/{id}")
    public Ticket updateTicket(

            @PathVariable Long id,

            @Valid
            @RequestBody
            Ticket incoming) {


        Ticket ticket = repository
                .findById(id)
                .orElseThrow(
                        () -> new TicketNotFoundException(id)
                );


        ticket.setTitle(
                incoming.getTitle()
        );


        ticket.setDescription(
                incoming.getDescription()
        );


        ticket.setStatus(
                incoming.getStatus().toUpperCase()
        );


        ticket.setCategory(
                incoming.getCategory()
        );


        return repository.save(ticket);
    }


    /*
     * DELETE TICKET
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTicket(
            @PathVariable Long id) {


        if (!repository.existsById(id)) {

            throw new TicketNotFoundException(id);
        }


        repository.deleteById(id);
    }
}