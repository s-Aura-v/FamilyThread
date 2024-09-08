package com.family_thread.family_thread_v1.utils;

import com.family_thread.family_thread_v1.enumeration.Permissions;

public class PermissionEnumConverter {


    public static Permissions convertStringToPermissionEnum(String value) {
        for (Permissions permission: Permissions.values()) {
            if (permission.name().equalsIgnoreCase(value)) {
                return permission;
            }
        }
        throw new IllegalArgumentException("No enum constant matches " + value);
    }
}
