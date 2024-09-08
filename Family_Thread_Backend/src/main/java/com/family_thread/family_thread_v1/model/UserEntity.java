package com.family_thread.family_thread_v1.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.ArrayList;

@Document(collection = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {

    public UserEntity(String name, String email, String sub, ArrayList<String> userCreatedTreeIds, ArrayList<String> sharedTreeIds) {

        this.name = name;
        this.email = email;
        this.sub = sub;
        this.userCreatedTreeIds = userCreatedTreeIds;
        this.sharedTreeIds = sharedTreeIds;
    }

    @Id
    private String id;

    private String name;
    private String email;
    private String sub;

//    @DocumentReference
    private ArrayList<String> userCreatedTreeIds;
    private ArrayList<String> sharedTreeIds;

}
