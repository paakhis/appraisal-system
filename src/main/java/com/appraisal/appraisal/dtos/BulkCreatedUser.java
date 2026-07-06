package com.appraisal.appraisal.dtos;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Wraps a successfully-created user from a bulk upload row. temporaryPassword
// is only populated when the spreadsheet left the password column blank and
// the system generated one — HR needs to see it here since it's never
// retrievable again afterwards (it's hashed on first login, same as any
// other user's password).
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BulkCreatedUser {
    private UserResponse user;
    private String temporaryPassword;
}