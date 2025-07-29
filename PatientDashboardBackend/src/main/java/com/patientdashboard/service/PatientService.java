package com.patientdashboard.service;

import com.patientdashboard.model.Patient;
import com.patientdashboard.model.Status;
import com.patientdashboard.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient updateStatus(UUID id, String newStatus) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setStatus(Status.valueOf(newStatus));
        return patientRepository.save(patient);
    }
}