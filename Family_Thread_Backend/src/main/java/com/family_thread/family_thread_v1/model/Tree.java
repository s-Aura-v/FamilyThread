package com.family_thread.family_thread_v1.model;


import com.family_thread.family_thread_v1.enumeration.Permissions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;

@Document(collection = "trees")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Tree {

    public Tree(String treeName, HashMap<Permissions, ArrayList<String>> usersAssociated, ArrayList<String> jsonData, String image64) {
        this.treeName = treeName;
        this.usersAssociated = usersAssociated;
        this.jsonData = jsonData;
        this.image64 = image64;
    }

    @Id
    private String id;
    private String treeName;
    private HashMap<Permissions, ArrayList<String>> usersAssociated;
    private ArrayList<String> jsonData;
    private String image64;


}
