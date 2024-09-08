package com.family_thread.family_thread_v1.repository;

import com.family_thread.family_thread_v1.model.Tree;
import lombok.NonNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TreeRepository extends MongoRepository<Tree, String> {

    Optional<Tree> findById(String id);
}