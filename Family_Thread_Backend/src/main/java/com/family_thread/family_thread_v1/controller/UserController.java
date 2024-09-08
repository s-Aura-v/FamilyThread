package com.family_thread.family_thread_v1.controller;


import com.family_thread.family_thread_v1.dto.UserTreesDto;
import com.family_thread.family_thread_v1.model.Tree;
import com.family_thread.family_thread_v1.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/trees")
    public ResponseEntity<Optional<ArrayList<UserTreesDto>>> getUserCreatedTrees() {
        return new ResponseEntity<>(userService.getTreesAssociated(), HttpStatus.OK);
    }

    @GetMapping("/trees/shared")
    public ResponseEntity<Optional<ArrayList<UserTreesDto>>> getSharedTrees() {
        return new ResponseEntity<>(userService.getSharedTrees(), HttpStatus.OK);
    }

    @GetMapping("/trees/ft")
    public ResponseEntity<Optional<ArrayList<UserTreesDto>>> getFeaturedTrees() {
        return new ResponseEntity<>(userService.getTreesOwnedByFT(), HttpStatus.OK);
    }
}
