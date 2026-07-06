// package com.appraisal.appraisal.controller;

// import com.appraisal.appraisal.dtos.LoginRequest;
// import com.appraisal.appraisal.dtos.LoginResponse;
// import com.appraisal.appraisal.service.AuthService;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.http.MediaType;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.BDDMockito.given;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @WebMvcTest(AuthController.class)
// class AuthControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private AuthService authService;

//     @Test
//     void loginShouldReturnUserDetailsForValidCredentials() throws Exception {
//         LoginResponse response = new LoginResponse(1L, "Jane Doe", "jane@example.com", "EMPLOYEE");
//         given(authService.login(any(LoginRequest.class))).willReturn(response);

//         mockMvc.perform(post("/api/auth/login")
//                         .contentType(MediaType.APPLICATION_JSON)
//                         .content("{\"email\":\"jane@example.com\",\"password\":\"secret\"}"))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.email").value("jane@example.com"))
//                 .andExpect(jsonPath("$.role").value("EMPLOYEE"));
//     }
// }
