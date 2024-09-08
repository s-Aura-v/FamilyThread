package com.family_thread.family_thread_v1.controller;

import com.family_thread.family_thread_v1.dto.LoginDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@CrossOrigin
public class OAuthController {

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        LoginDto data = new LoginDto(
                principal.getAttribute("name"),
                principal.getAttribute("email"),
                principal.getAttribute("picture")
        );
        return Collections.singletonMap("user_details", data);
    }

    @GetMapping("/verify")
    public Authentication isUserLogIn() {
        return SecurityContextHolder.getContext().getAuthentication();
     }
}
