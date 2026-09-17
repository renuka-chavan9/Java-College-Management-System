package com.example.college;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository repository;

    public StudentController(StudentRepository repository) {
        this.repository = repository;
    }

    // GET ALL STUDENTS
    @GetMapping
    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    // GET ONE STUDENT
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable String id) {

        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ADD STUDENT
    @PostMapping
    public ResponseEntity<Student> createStudent(
            @RequestBody Student student) {

        Student savedStudent = repository.save(student);

        return ResponseEntity.ok(savedStudent);
    }

    // UPDATE STUDENT
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable String id,
            @RequestBody Student updatedStudent) {

        return repository.findById(id)
                .map(student -> {

                    student.setName(updatedStudent.getName());
                    student.setAge(updatedStudent.getAge());
                    student.setCity(updatedStudent.getCity());
                    student.setCourse(updatedStudent.getCourse());
                    student.setEmail(updatedStudent.getEmail());

                    Student savedStudent = repository.save(student);

                    return ResponseEntity.ok(savedStudent);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE STUDENT
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable String id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Student deleted successfully");
    }
}

