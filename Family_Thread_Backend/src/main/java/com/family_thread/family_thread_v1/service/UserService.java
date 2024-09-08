package com.family_thread.family_thread_v1.service;

import com.family_thread.family_thread_v1.dto.UserTreesDto;
import com.family_thread.family_thread_v1.model.Tree;
import com.family_thread.family_thread_v1.model.UserEntity;
import com.family_thread.family_thread_v1.repository.TreeRepository;
import com.family_thread.family_thread_v1.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final TreeRepository treeRepository;


    public Optional<ArrayList<UserTreesDto>> getTreesAssociated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String subjectId = oauth2User.getAttribute("sub");
        Optional<UserEntity> user =  userRepository.findBySub(subjectId);

        if (user.isPresent()) {
            UserEntity userData = user.get();

            ArrayList<UserTreesDto> treeNames = new ArrayList<>();
            for (String treeid: userData.getUserCreatedTreeIds()) {
                Optional<Tree> treeOptional = treeRepository.findById(treeid);
                if (treeOptional.isPresent()) {
                    treeNames.add(new UserTreesDto(treeid, treeOptional.get().getTreeName(), treeOptional.get().getImage64()) );
                }
            }
            return Optional.of(treeNames);
        } else {
            return Optional.empty();
        }
    }

    public Optional<ArrayList<UserTreesDto>> getSharedTrees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String subjectId = oauth2User.getAttribute("sub");
        Optional<UserEntity> user =  userRepository.findBySub(subjectId);

        if (user.isPresent()) {
            UserEntity userData = user.get();

            ArrayList<UserTreesDto> treeNames = new ArrayList<>();
            for (String treeid: userData.getSharedTreeIds()) {
                Optional<Tree> treeOptional = treeRepository.findById(treeid);
                if (treeOptional.isPresent()) {
                    treeNames.add(new UserTreesDto(treeid, treeOptional.get().getTreeName(), treeOptional.get().getImage64()) );
                }
            }
            return Optional.ofNullable(treeNames);
        } else {
            return Optional.empty();
        }
    }

    public Optional<UserEntity> getUserData(String userId) {

        Optional<UserEntity> getUser = userRepository.findById(userId);
        if (getUser.isEmpty()) {
            return Optional.empty();
        }
        return getUser;
    }

    public Optional<UserEntity> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String subjectId = oauth2User.getAttribute("sub");
        System.out.println(subjectId);
        return userRepository.findBySub(subjectId);
    }

    public Optional<ArrayList<UserTreesDto>> getTreesOwnedByFT() {
        Optional<UserEntity> user = userRepository.findById("6624385e3e5e7f0a1e8a1b72");

        if (user.isPresent()) {
            UserEntity userData = user.get();
            ArrayList<UserTreesDto> treeList = new ArrayList<>();

            for (String treeId : userData.getUserCreatedTreeIds()) {
                Optional<Tree> tree = treeRepository.findById(treeId);
                tree.ifPresent(t -> treeList.add(new UserTreesDto(treeId, t.getTreeName(), t.getImage64())));
            }

            return Optional.of(treeList);
        } else {
            return Optional.empty();
        }
    }

}
