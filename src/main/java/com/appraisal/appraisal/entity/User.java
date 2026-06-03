package com.appraisal.appraisal.entity;

import com.appraisal.appraisal.entity.enums.Roles;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (name = "name", nullable = false)
    private String name;

    @Column (name = "email", nullable = false, unique = true)
    private String email;

    @Column (name = "password", nullable = false)
    private String password;

    @Enumerated (EnumType.STRING)
    @Column (name = "role" , nullable = false)
    private Roles roles;

    @ManyToOne
    @JoinColumn (name = "department", nullable = false)
    private Department department;

    @Column (name = "designation")
    private String designation;

    @Column (name = "manager")
    private String manager;

    @Column (name = "createdAt")
    private LocalDateTime createdAt;

    @Column (name = "updatedAt")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }
}
