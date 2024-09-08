package com.family_thread.family_thread_v1.dto;

import com.family_thread.family_thread_v1.enumeration.Permissions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class OwnerManagedUsers {

    String userId;
    String name;
    Permissions userPermission;
    String userEmail;
}
