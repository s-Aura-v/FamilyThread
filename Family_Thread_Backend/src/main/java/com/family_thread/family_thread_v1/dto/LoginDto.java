package com.family_thread.family_thread_v1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginDto {
    private String name;
    private String emailAddress;
    private String profilePicture;
}
