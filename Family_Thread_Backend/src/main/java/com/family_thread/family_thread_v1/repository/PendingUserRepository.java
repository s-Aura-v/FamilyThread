package com.family_thread.family_thread_v1.repository;

import com.family_thread.family_thread_v1.model.PendingUserEntity;
import com.family_thread.family_thread_v1.model.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PendingUserRepository extends MongoRepository<PendingUserEntity, String> {

    Optional<PendingUserEntity> findByEmail(String userEmail);
}
