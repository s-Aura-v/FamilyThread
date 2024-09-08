package com.family_thread.family_thread_v1.service;

import com.family_thread.family_thread_v1.dto.OwnerManagedUsers;
import com.family_thread.family_thread_v1.dto.TreeDto;
import com.family_thread.family_thread_v1.enumeration.Permissions;
import com.family_thread.family_thread_v1.model.*;
import com.family_thread.family_thread_v1.repository.PendingUserRepository;
import com.family_thread.family_thread_v1.repository.TreeRepository;
import com.family_thread.family_thread_v1.repository.UserRepository;
import com.family_thread.family_thread_v1.utils.PermissionEnumConverter;
import lombok.AllArgsConstructor;
import org.apache.catalina.User;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class TreeService {

    private final TreeRepository treeRepository;

    private final UserRepository userRepository;

    private final PendingUserRepository pendingUserRepository;

    private final MongoTemplate mongoTemplate;

    private final EmailService emailService;

    private final UserService userService;

    private final NodeService nodeService;



    public List<TreeDto> allTrees() {
        List<Tree> treesRaw = treeRepository.findAll();
        return convertToTreeDto(treesRaw);
    }

    private List<TreeDto> convertToTreeDto(List<Tree> treesRaw) {
        List<TreeDto> converted = new ArrayList<>();
        Optional<UserEntity> user = getCurrentUserFromDatabase();

        if (user.isEmpty()) {
            return null;
        }


        for (Tree t: treesRaw) {
            UserEntity accessingUser = user.get();
            String treeOwner = t.getUsersAssociated().get(Permissions.OWNER).get(0);
            boolean isEditor = t.getUsersAssociated().get(Permissions.EDITOR).contains(accessingUser.getId());
            boolean isViewer = t.getUsersAssociated().get(Permissions.VIEWER).contains(accessingUser.getId());
            TreeDto td = new TreeDto(t.getId(), t.getTreeName(), t.getJsonData(), accessingUser.getId().equalsIgnoreCase(treeOwner), isEditor, isViewer);
            converted.add(td);
        }
        return converted;
    }

    public Optional<TreeDto> getSingleTree(String id) {
        Optional<Tree> optionalTree = treeRepository.findById(id);

        Optional<UserEntity> user = getCurrentUserFromDatabase();

        if (optionalTree.isPresent() && user.isPresent()) {
            Tree t = optionalTree.get();
            for (Permissions permission : t.getUsersAssociated().keySet()) {
                if (t.getUsersAssociated().get(permission).contains(user.get().getId())) {
                    String treeOwner = t.getUsersAssociated().get(Permissions.OWNER).get(0);
                    boolean isEditor = t.getUsersAssociated().get(Permissions.EDITOR).contains(user.get().getId());
                    boolean isViewer = t.getUsersAssociated().get(Permissions.VIEWER).contains(user.get().getId());
                    TreeDto td = new TreeDto(t.getId(), t.getTreeName(), t.getJsonData(), user.get().getId().equalsIgnoreCase(treeOwner), isEditor, isViewer);
                    return Optional.of(td);
                }
            }
        }
        return Optional.empty();

    }


    public Tree createTree(String treeName) {

        Optional<UserEntity> user = userService.getCurrentUser();

        if (user.isPresent()) {
            UserEntity currentUser = user.get();
            HashMap<Permissions, ArrayList<String>> newHashMap = new HashMap<>();
            newHashMap.put(Permissions.OWNER, new ArrayList<>());
            newHashMap.put(Permissions.EDITOR, new ArrayList<>());
            newHashMap.put(Permissions.VIEWER, new ArrayList<>());
            newHashMap.get(Permissions.OWNER).add(currentUser.getId());


            Tree newTree = new Tree(treeName,newHashMap, new ArrayList<>(), "");
            treeRepository.insert(newTree);

            NodeEntity nodeEntity = new NodeEntity();
            nodeEntity.setId("1");
            ArrayList<NodeEntity> newNodes = new ArrayList<>();
            newNodes.add(nodeEntity);

            nodeService.addNodeToTree(newTree.getId(), newNodes);

            mongoTemplate.update(UserEntity.class)
                    .matching(Criteria.where("sub").is(currentUser.getSub()))
                    .apply(new Update().addToSet("userCreatedTreeIds").value(newTree.getId()))
                    .first();

            return newTree;
        }
        return null;

    }

    public ResponseEntity<String> shareTree(String treeId, Map<String, String> data) {
        Optional<UserEntity> userOptional = getCurrentUserFromDatabase();
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }

        UserEntity loggedInUser = userOptional.get();
        if (!loggedInUser.getUserCreatedTreeIds().contains(treeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to share");
        }

        Optional<Tree> treeOptional = treeRepository.findById(treeId);
        if (treeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tree does not exist");
        }

        Tree tree = treeOptional.get();
        Permissions addedUserPermission = PermissionEnumConverter.convertStringToPermissionEnum(data.get("role"));

        Optional<UserEntity> userToAddOptional = userRepository.findByEmail(data.get("email"));
        if (userToAddOptional.isEmpty()) {

            boolean checkIfExists = checkTreeIdAndRole(treeId, data);


            if (!checkIfExists) {
                addUserToPendingUsers(tree, data.get("email"), addedUserPermission);
                sendEmailForSharing(data.get("email"), loggedInUser.getName(), tree);

                return ResponseEntity.status(HttpStatus.OK).body("Added user's account is not created, but will be able to access the tree after registration");
            } else {
                return ResponseEntity.status(HttpStatus.OK).body("User already added, but haven't created an account yet");
            }
        }

        UserEntity userToAdd = userToAddOptional.get();
        System.out.println(tree.getUsersAssociated());
        boolean alreadyOwner = tree.getUsersAssociated().getOrDefault(Permissions.OWNER, new ArrayList<>()).contains(userToAdd.getId());
        boolean alreadyEditor = tree.getUsersAssociated().getOrDefault(Permissions.EDITOR, new ArrayList<>()).contains(userToAdd.getId());
        boolean alreadyViewer = tree.getUsersAssociated().getOrDefault(Permissions.VIEWER, new ArrayList<>()).contains(userToAdd.getId());

        if (alreadyOwner) {
            return ResponseEntity.ok("You are the owner");
        }

        if (alreadyEditor || alreadyViewer) {
            return ResponseEntity.ok("User already added");
        }

        addUserToTree(tree, userToAdd, addedUserPermission);
        updateUserRepository(userToAdd, tree);
        sendEmailForSharing(userToAdd.getEmail(), loggedInUser.getName(), tree);

        return ResponseEntity.ok("User added successfully");
    }
    public ResponseEntity<String> addImgToTree(String treeId, Map<String, String> data) {
        mongoTemplate.update(Tree.class)
                .matching(Criteria.where("id").is(treeId))
                .apply(new Update().set("image64", data.get("image64")))
                .first();

        return ResponseEntity.ok("Added image64 to the database");
    }


    public Optional<HashMap<Permissions, ArrayList<OwnerManagedUsers>>> getAllUsersFromTree(String treeId) {
        Optional<Tree> treeOptional = treeRepository.findById(treeId);

        if (treeOptional.isEmpty()) {
            return Optional.empty();
        }

        HashMap<Permissions, ArrayList<String>> treeAssociatedUserIds = treeOptional.get().getUsersAssociated();

        HashMap<Permissions, ArrayList<OwnerManagedUsers>> ownerManagedUsersHashMap = new HashMap<>();
        for (Permissions p: treeAssociatedUserIds.keySet()) {

            ArrayList<OwnerManagedUsers> arrayListForOnePermission = new ArrayList<>();
            for (String userId: treeAssociatedUserIds.get(p)) {
                Optional<UserEntity> user = userService.getUserData(userId);
                OwnerManagedUsers ownerManagedUsers = new OwnerManagedUsers(
                        userId,
                        user.get().getName(),
                        p,
                        user.get().getEmail());

                arrayListForOnePermission.add(ownerManagedUsers);

            }
            ownerManagedUsersHashMap.put(p, arrayListForOnePermission);
        }
        return Optional.of(ownerManagedUsersHashMap);


    }

    public ResponseEntity<String> checkIfUserIsAuthorized(String treeId) {
        Optional<UserEntity> userOptional = getCurrentUserFromDatabase();
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }

        UserEntity loggedInUser = userOptional.get();
        if (!loggedInUser.getUserCreatedTreeIds().contains(treeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to share");
        }

        Optional<Tree> treeOptional = treeRepository.findById(treeId);
        if (treeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tree does not exist");
        }

        return ResponseEntity.status(HttpStatus.OK).body("User is authorized");
    }

    public ResponseEntity<String> updateUserAssociatedWithTree(String treeId, Map<String, String> data) {
        Optional<UserEntity> userOptional = getCurrentUserFromDatabase();
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }

        UserEntity loggedInUser = userOptional.get();
        if (!loggedInUser.getUserCreatedTreeIds().contains(treeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized");
        }

        Optional<Tree> treeOptional = treeRepository.findById(treeId);
        if (treeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tree does not exist");
        }

        Tree tree = treeOptional.get();

        for (Permissions p: tree.getUsersAssociated().keySet()) {
            for (String id: tree.getUsersAssociated().get(p)) {
                if (id.equalsIgnoreCase(data.get("userId"))) {

                    mongoTemplate.update(Tree.class)
                            .matching(Criteria.where("id").is(tree.getId()))
                            .apply(new Update().pull("usersAssociated." + p.toString() , id))
                            .first();

                    mongoTemplate.update(Tree.class)
                            .matching(Criteria.where("id").is(tree.getId()))
                            .apply(new Update().addToSet("usersAssociated." + data.get("userPermission"), id))
                            .first();
                    return  ResponseEntity.ok("Success updating");
                }
            }
        }

        return ResponseEntity.ok("User doesn't exist");
    }

    public ResponseEntity<String> removeUserFromTree(String treeId, Map<String, String> data) {
        Optional<UserEntity> userOptional = getCurrentUserFromDatabase();
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }

        UserEntity loggedInUser = userOptional.get();
        if (!loggedInUser.getUserCreatedTreeIds().contains(treeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized");
        }

        Optional<Tree> treeOptional = treeRepository.findById(treeId);
        if (treeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tree does not exist");
        }

        Tree tree = treeOptional.get();

        for (Permissions p: tree.getUsersAssociated().keySet()) {
            for (String id: tree.getUsersAssociated().get(p)) {
                if (id.equalsIgnoreCase(data.get("userId"))) {

                    mongoTemplate.update(Tree.class)
                            .matching(Criteria.where("id").is(tree.getId()))
                            .apply(new Update().pull("usersAssociated." + p.toString() , id))
                            .first();

                    mongoTemplate.update(UserEntity.class)
                            .matching(Criteria.where("id").is(data.get("userId")))
                            .apply(new Update().pull("sharedTreeIds", tree.getId()))
                            .first();

                    return  ResponseEntity.ok("Success removing user: " + data.get("name") + " (" + data.get("userEmail") + ")");
                }
            }
        }

        return ResponseEntity.ok("User doesn't exist");
    }

    private void sendEmailForSharing(String recipientEmail, String ownerName, Tree tree) {
        String messageBody = "Hello,\n\n" +
                "You have been invited to join the family Tree, named \"" + tree.getTreeName() + "\"  from user, " + ownerName  + " . This invitation allows you to access and contribute to this family tree.\n\n" +
                "http://moxie.cs.oswego.edu:5173/displayTrees/" + tree.getId() + "\n\n" +
                "Best regards,\n" +
                "FamilyThread";

        EmailDetails emailDetails = new EmailDetails(
                recipientEmail,
                messageBody,
                "Invitation to familyTree"
        );
        emailService.sendSimpleMail(emailDetails);
    }

    public ResponseEntity<String> deleteTree(String treeId) {


        Optional<UserEntity> userOptional = getCurrentUserFromDatabase();
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You are not logged in");
        }

        UserEntity loggedInUser = userOptional.get();
        if (!loggedInUser.getUserCreatedTreeIds().contains(treeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized");
        }

        Optional<Tree> treeOptional = treeRepository.findById(treeId);
        if (treeOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tree does not exist");
        }

        Tree tree = treeOptional.get();

        for (Permissions p: tree.getUsersAssociated().keySet()) {
            for (String userId: tree.getUsersAssociated().get(p)) {
                    mongoTemplate.update(UserEntity.class)
                            .matching(Criteria.where("id").is(userId))
                            .apply(new Update().pull("sharedTreeIds", tree.getId()))
                            .first();

                System.out.println(userId);

            }
        }

        System.out.println("Should delete");
        mongoTemplate.remove(new Query().addCriteria(Criteria.where("id").is(treeId)), Tree.class);

        return ResponseEntity.status(HttpStatus.OK).body("Tree have been removed");


    }

    private boolean checkTreeIdAndRole(String treeId, Map<String, String> data) {
        Optional<PendingUserEntity> pendingUserEntityOptional = pendingUserRepository.findByEmail(data.get("email"));
        if (pendingUserEntityOptional.isPresent()) {
            PendingUserEntity pendingUserEntity = pendingUserEntityOptional.get();

            return pendingUserEntity.getToBeAssociatedTrees().stream()
                     .anyMatch(t ->
                         t.getTreeId().equalsIgnoreCase(treeId)
                     );
        }
        return false;
    }

    private void addUserToPendingUsers(Tree tree, String userEmail, Permissions userPermission) {

        Optional<PendingUserEntity> pendingUserEntity = pendingUserRepository.findByEmail(userEmail);

        if (pendingUserEntity.isEmpty()) {
            ArrayList<PendingUserEntity.TreeIdAndRole> currentAssociatedTrees = new ArrayList<>();
            currentAssociatedTrees.add(new PendingUserEntity.TreeIdAndRole(tree.getId(), userPermission));
            pendingUserRepository.save(new PendingUserEntity(userEmail, currentAssociatedTrees));
        } else {
            mongoTemplate.update(PendingUserEntity.class)
                    .matching(Criteria.where("email").is(userEmail))
                    .apply(new Update().addToSet("toBeAssociatedTrees").value(new PendingUserEntity.TreeIdAndRole(tree.getId(), userPermission)))
                    .first();
        }
    }


    private void addUserToTree(Tree tree, UserEntity userToAdd, Permissions permission) {
        mongoTemplate.update(Tree.class)
                .matching(Criteria.where("id").is(tree.getId()))
                .apply(new Update().addToSet("usersAssociated." + permission.toString(), userToAdd.getId()))
                .first();
    }

    private void updateUserRepository(UserEntity userToAdd, Tree tree) {
        mongoTemplate.update(UserEntity.class)
                .matching(Criteria.where("id").is(userToAdd.getId()))
                .apply(new Update().addToSet("sharedTreeIds").value(tree.getId()))
                .first();
    }

    private Optional<UserEntity> getCurrentUserFromDatabase() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String subjectId = oauth2User.getAttribute("sub");
        return userRepository.findBySub(subjectId);
    }




}