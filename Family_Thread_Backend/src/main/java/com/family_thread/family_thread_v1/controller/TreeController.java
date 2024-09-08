package com.family_thread.family_thread_v1.controller;


import com.family_thread.family_thread_v1.dto.TreeDto;
import com.family_thread.family_thread_v1.model.Tree;
import com.family_thread.family_thread_v1.service.TreeService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tree")
public class TreeController {

    private final TreeService treeService;

    @Autowired
    public TreeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping
    public ResponseEntity<List<TreeDto>> getAllTrees() {
        return new ResponseEntity<>(treeService.allTrees(), HttpStatus.OK);
    }

    @GetMapping("/{treeId}")
    public ResponseEntity<Optional<TreeDto>> getSingleTree(@PathVariable String treeId) {
        if (treeService.getSingleTree(treeId).isPresent()) {
            System.out.println(treeService.getSingleTree(treeId));
            return new ResponseEntity<>(treeService.getSingleTree(treeId), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }
    }


    @PostMapping("/new")
    public HashMap<String, String> createTree(@RequestBody Map<String, String> payload) {
        Tree tree = treeService.createTree(payload.get("treeName"));
        return new HashMap<>(){{
            put("redirect",  tree.getId());
        }};
    }

    @PostMapping("/{treeId}/add-img")
    public ResponseEntity<String> addImageToTree(@PathVariable String treeId, @RequestBody Map<String, String> data) {
        return treeService.addImgToTree(treeId, data);
    }


    @PostMapping("/{treeId}/delete-tree")
    public ResponseEntity<String> deleteTree(@PathVariable String treeId) {
        System.out.println("executed");
        return treeService.deleteTree(treeId);

    }




}