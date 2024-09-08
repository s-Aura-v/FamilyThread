package com.family_thread.family_thread_v1.controller;

import com.family_thread.family_thread_v1.model.EmailDetails;
import com.family_thread.family_thread_v1.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EmailController {

    private EmailService emailService;

    // Sending a simple Email
    @PostMapping("/test/sendmail")
    public String sendMail(@RequestBody EmailDetails details)
    {
        String status = emailService.sendSimpleMail(details);
        return status;
    }
}
