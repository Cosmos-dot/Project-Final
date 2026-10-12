package com.forensics.email;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = EmailForensicsApplication.class)
@AutoConfigureMockMvc
class SecurityAuthenticationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Should allow public access or handle open endpoints")
    void publicEndpoint_ShouldBeAccessible() throws Exception {
        mockMvc.perform(get("/")) 
                .andExpect(status().is3xxRedirection());
    }

    @Test
    @DisplayName("Should reject unauthorized requests to secured endpoints")
    void securedEndpoint_WithoutAuth_ShouldBeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/analyze")) 
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "analyst", roles = {"USER"})
    @DisplayName("Should allow authenticated users to access secured endpoints")
    void securedEndpoint_WithValidUser_ShouldSucceed() throws Exception {
        mockMvc.perform(get("/api/analyze")) 
                .andExpect(status().isOk());
    }
}