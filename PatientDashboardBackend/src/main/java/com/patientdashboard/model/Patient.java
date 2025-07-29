package com.patientdashboard.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    private String firstName;
    private String middleName;
    private String lastName;

    private LocalDate dob;

    @Enumerated(EnumType.STRING)
    private Status status;
    private String country;
    private String aptUnit;
    private String street;
    private String city;
    private String state;
    private String postalCode;
}