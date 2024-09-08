package com.family_thread.family_thread_v1.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
// Class
public class NodeEntity {

    @Field(name = "id")
    private String id;
    private String name;
    private String mid;
    private String fid;
    private String[] pids;
    private String gender;
    private String dateOfBirth;
    private String dateOfDeath;
    private String placeOfBirth;
    private String img;
    private String description;

}