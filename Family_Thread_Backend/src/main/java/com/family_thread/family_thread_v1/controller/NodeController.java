package com.family_thread.family_thread_v1.controller;

import com.family_thread.family_thread_v1.model.NodeEntity;
import com.family_thread.family_thread_v1.service.NodeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/{treeId}")
@AllArgsConstructor
public class NodeController {

    private NodeService nodeService;


    /**
     * Add a new node to the jsonData in MongoDB
     * @param treeId - id of tree
     * @param newNodes - the nodes that are going to be input (made by Tree Library)
     * @return String
     */
    @PostMapping("/add-nodes")
    public ResponseEntity<String> addTreeNodes(@PathVariable String treeId, @RequestBody HashMap<String, ArrayList<NodeEntity>> newNodes) {

        nodeService.addNodeToTree(treeId, newNodes.get("newNodes"));
        return ResponseEntity.ok("Successfully added to " + treeId);
    }


    /**
     * Updating the data
     * @param treeId - the tree id
     * @param newNodes - the nodes that are going to be modified (made by Tree Library)
     * @return String
     */
    @PostMapping("/update-nodes")
    public ResponseEntity<String> updateTreeNodes(@PathVariable String treeId, @RequestBody HashMap<String, ArrayList<NodeEntity>> newNodes) {
        nodeService.updateTreeNode(treeId, newNodes.get("newNodes"));
        return ResponseEntity.ok("Successfully updated to " + treeId);

    }


    /**
     *
     * @param treeId
     * @param nodeIdMap
     * @return
     */
    @PostMapping("/remove-nodes")
    public ResponseEntity<String> removeNodes(@PathVariable String treeId, @RequestBody HashMap<String, String> nodeIdMap) {
        nodeService.removeNode(treeId, nodeIdMap.get("nodeId"));
        return ResponseEntity.ok("Successfully removed " + treeId);
    }

    /**
     * Updating the data
     * @param treeId - the tree id
     * @param importNodes - the nodes that are going to added
     * @return String
     */
    @PostMapping("/import-nodes")
    public Optional<ArrayList<String>> importTreeNodes(@PathVariable String treeId, @RequestBody ArrayList<NodeEntity> importNodes) {
        return nodeService.importTreeNodes(treeId, importNodes);
    }

}
