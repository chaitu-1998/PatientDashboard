package com.patientdashboard.controller;

import com.patientdashboard.model.Patient;
import com.patientdashboard.model.Status;
import com.patientdashboard.security.JwtUtil;
import com.patientdashboard.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin".equals(username) && "admin123".equals(password)) {
            String token = jwtUtil.generateToken(username, "ROLE_ADMIN");
            return ResponseEntity.ok(Map.of("token", token, "role", "admin"));
        }

        if ("user".equals(username) && "user123".equals(password)) {
            String token = jwtUtil.generateToken(username, "ROLE_USER");
            return ResponseEntity.ok(Map.of("token", token, "role", "user"));
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient saved = patientService.savePatient(patient);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getStatuses() {
        return ResponseEntity.ok(Arrays.stream(Status.values())
                .map(Enum::name)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Patient> updatePatientStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        Patient updated = patientService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
}