package com.family_thread.family_thread_v1.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TreeDto {

    public TreeDto(String id, String treeName, ArrayList<String> jsonData, boolean isOwner, boolean isEditor, boolean isViewer) {
        this.id = id;
        this.treeName = treeName;
        this.jsonData = jsonData;
        this.isOwner = isOwner;
        this.isEditor = isEditor;
        this.isViewer = isViewer;
    }

    @Id
    private String id;
    private String treeName;
    private ArrayList<String> jsonData;
    private boolean isOwner;
    private boolean isEditor;
    private boolean isViewer;
    private String image64;

}
