package com.family_thread.family_thread_v1.service;


import com.family_thread.family_thread_v1.dto.TreeDto;
import com.family_thread.family_thread_v1.enumeration.Permissions;
import com.family_thread.family_thread_v1.model.NodeEntity;
import com.family_thread.family_thread_v1.model.Tree;
import com.family_thread.family_thread_v1.repository.TreeRepository;
import com.mongodb.BasicDBObject;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.w3c.dom.Node;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.Optional;

@Service
@AllArgsConstructor
public class NodeService {

    private final TreeRepository treeRepository;
    private final MongoTemplate mongoTemplate;
    private final UserService userService;

    /**
     * Adding node to the tree
     * @param treeId - id of the tree
     * @param newNodes - the nodes that are going to be added
     */
    public void addNodeToTree(String treeId, ArrayList<NodeEntity> newNodes) {

        mongoTemplate.update(Tree.class)
                .matching(Criteria.where("id").is(treeId))
                .apply(new Update().addToSet("jsonData").each(newNodes))
                .first();
    }


    /**
     * Node service that updates the node by deleting that node and inserting the most resent node
     * @param treeId - id of the tree
     * @param updateNodes - the nodes that are going to be updated
     */
    public void updateTreeNode(String treeId, ArrayList<NodeEntity> updateNodes) {

        for (NodeEntity nodeEntity: updateNodes) {

            // Query to match the document by the tree ID
            Query query = Query.query(Criteria.where("_id").is(treeId));

            // Remove the node from the jsonData array with the matching ID
            Update pullUpdate = new Update().pull("jsonData", new BasicDBObject("id", nodeEntity.getId()));
            mongoTemplate.updateFirst(query, pullUpdate, Tree.class);


            // Add the new node entity to the jsonData array
            Update addUpdate = new Update().addToSet("jsonData", nodeEntity);
            mongoTemplate.updateFirst(query, addUpdate, Tree.class);
        }

    }

    public void removeNode(String treeId, String nodeId) {
        // Query to match the document by the tree ID
        Query query = Query.query(Criteria.where("_id").is(treeId));

        // Remove the node from the jsonData array with the matching ID
        Update pullUpdate = new Update().pull("jsonData", new BasicDBObject("id", nodeId));
        mongoTemplate.updateFirst(query, pullUpdate, Tree.class);
    }

    /**
     * Node service that updates the node by deleting that node and inserting the most resent node
     * @param treeId - id of the tree
     * @param importNodes - the nodes that are going to be updated
     */
    public Optional<ArrayList<String>> importTreeNodes(String treeId, ArrayList<NodeEntity> importNodes) {

        try {
            mongoTemplate.update(Tree.class)
                    .matching(Criteria.where("id").is(treeId))
                    .apply(new Update().set("jsonData", new ArrayList<>()))
                    .first();

            mongoTemplate.update(Tree.class)
                    .matching(Criteria.where("id").is(treeId))
                    .apply(new Update().addToSet("jsonData").each(importNodes))
                    .first();

            Optional<Tree> treeOptional = treeRepository.findById(treeId);

            return treeOptional.map(Tree::getJsonData);

        } catch(Error e) {
            return Optional.empty();
        }


    }
}
