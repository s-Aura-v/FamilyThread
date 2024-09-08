package com.family_thread.family_thread_v1.model;


import com.family_thread.family_thread_v1.enumeration.Permissions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.lang.reflect.Array;
import java.util.ArrayList;

@Document(collection = "pending-users")
@Data
@NoArgsConstructor
public class PendingUserEntity {

    public PendingUserEntity(String email, ArrayList<TreeIdAndRole> toBeAssociatedTrees) {
        this.email = email;
        this.toBeAssociatedTrees = toBeAssociatedTrees;
    }

    @Id
    private String id;

    private String email;
    private ArrayList<TreeIdAndRole> toBeAssociatedTrees;

    @Data
    @AllArgsConstructor
    public static class TreeIdAndRole {
        private String treeId;
        private Permissions role;
    }
}
