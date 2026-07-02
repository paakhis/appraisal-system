package com.appraisal.appraisal.controller;

import com.appraisal.appraisal.dtos.GoalResponse;
import com.appraisal.appraisal.entity.enums.GoalStatus;
import com.appraisal.appraisal.service.GoalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GoalController.class)
class GoalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GoalService goalService;

    @Test
    void acknowledgeEndpointShouldBeAvailable() throws Exception {
        GoalResponse response = new GoalResponse();
        response.setId(1L);
        response.setStatus(GoalStatus.ACKNOWLEDGED);
        given(goalService.acknowledgeGoal(1L)).willReturn(response);

        mockMvc.perform(patch("/api/goals/1/acknowledge")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void completeEndpointShouldBeAvailable() throws Exception {
        GoalResponse response = new GoalResponse();
        response.setId(1L);
        response.setStatus(GoalStatus.COMPLETED);
        given(goalService.completeGoal(1L)).willReturn(response);

        mockMvc.perform(patch("/api/goals/1/complete")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
