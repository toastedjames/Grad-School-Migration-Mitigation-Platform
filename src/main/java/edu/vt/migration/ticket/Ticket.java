package edu.vt.migration.ticket;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @NotBlank
    @Column(nullable = false)
    private String status;

    @NotBlank
    @Column(nullable = false)
    private String category;

    private Instant createdAt;

    private Instant updatedAt;


    protected Ticket() {
    }


    public Ticket(
            String title,
            String description,
            String status,
            String category) {

        this.title = title;
        this.description = description;
        this.status = status;
        this.category = category;
    }


    @PrePersist
    protected void onCreate() {

        createdAt = Instant.now();

        updatedAt = createdAt;
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt = Instant.now();
    }


    public Long getId() {
        return id;
    }


    public String getTitle() {
        return title;
    }


    public String getDescription() {
        return description;
    }


    public String getStatus() {
        return status;
    }


    public String getCategory() {
        return category;
    }


    public Instant getCreatedAt() {
        return createdAt;
    }


    public Instant getUpdatedAt() {
        return updatedAt;
    }


    public void setTitle(String title) {

        this.title = title;
    }


    public void setDescription(String description) {

        this.description = description;
    }


    public void setStatus(String status) {

        this.status = status;
    }


    public void setCategory(String category) {

        this.category = category;
    }
}