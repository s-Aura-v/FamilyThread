package com.family_thread.family_thread_v1.controller;


import com.family_thread.family_thread_v1.dto.OwnerManagedUsers;
import com.family_thread.family_thread_v1.enumeration.Permissions;
import com.family_thread.family_thread_v1.service.TreeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/share")
@AllArgsConstructor
public class ShareController {

    private TreeService treeService;

    @PostMapping("/{treeId}")
    public ResponseEntity<String> shareTree(@PathVariable String treeId, @RequestBody Map<String, String> data) {
        return treeService.shareTree(treeId, data);
    }

    @GetMapping("/{treeId}/getUsers")
    public Optional<HashMap<Permissions, ArrayList<OwnerManagedUsers>>> getUsersFromTree(@PathVariable String treeId) {
        if (treeService.checkIfUserIsAuthorized(treeId).getBody().equalsIgnoreCase("User is authorized")) {
            return treeService.getAllUsersFromTree(treeId);
        }
        return Optional.empty();
    }

    @PostMapping("/{treeId}/update-user")
    public ResponseEntity<String> updateUser(@PathVariable String treeId, @RequestBody Map<String, String> data) {
        return treeService.updateUserAssociatedWithTree(treeId, data);
    }

    @PostMapping("/{treeId}/remove-user")
    public ResponseEntity<String> removeUser(@PathVariable String treeId, @RequestBody Map<String, String> data) {
        return treeService.removeUserFromTree(treeId, data);
    }

}
