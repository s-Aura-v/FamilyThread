package com.family_thread.family_thread_v1.security;

import com.family_thread.family_thread_v1.model.PendingUserEntity;
import com.family_thread.family_thread_v1.model.Tree;
import com.family_thread.family_thread_v1.model.UserEntity;
import com.family_thread.family_thread_v1.repository.PendingUserRepository;
import com.family_thread.family_thread_v1.repository.TreeRepository;
import com.family_thread.family_thread_v1.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    private PendingUserRepository pendingUserRepository;

    private TreeRepository treeRepository;

    private MongoTemplate mongoTemplate;


    public OAuth2LoginSuccessHandler(UserRepository userRepository, PendingUserRepository pendingUserRepository, TreeRepository treeRepository, MongoTemplate mongoTemplate) {
        this.userRepository = userRepository;
        this.pendingUserRepository = pendingUserRepository;
        this.treeRepository = treeRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        this.setAlwaysUseDefaultTargetUrl(true);

        this.setDefaultTargetUrl(frontendUrl + "/viewTrees");
        super.onAuthenticationSuccess(request, response, authentication);

        OidcUser test = (OidcUser) authentication.getPrincipal();
        String email =Optional.ofNullable(test.getAttribute("email")).map(Object::toString).orElse(null);
        String name =Optional.ofNullable(test.getAttribute("name")).map(Object::toString).orElse(null);
        String sub =Optional.ofNullable(test.getAttribute("sub")).map(Object::toString).orElse(null);
        ArrayList<String> createdTreeIds = new ArrayList<>();
        ArrayList<String> shareTreeIds = new ArrayList<>();

        if (!userRepository.existsByEmail(email)) {
            UserEntity user = new UserEntity();
            user.setName(name);
            user.setEmail(email);
            user.setSub(sub);
            user.setUserCreatedTreeIds(createdTreeIds);
            user.setSharedTreeIds(shareTreeIds);
            userRepository.save(user);
        }

        Optional<PendingUserEntity> pendingUserEntityOptional = pendingUserRepository.findByEmail(email);

        if(pendingUserEntityOptional.isPresent()) {
            PendingUserEntity pendingUserEntity = pendingUserEntityOptional.get();
            for (PendingUserEntity.TreeIdAndRole toBeAssociatedTree : pendingUserEntity.getToBeAssociatedTrees()) {

                Optional<Tree> treeOptional = treeRepository.findById(toBeAssociatedTree.getTreeId());
                Optional<UserEntity> userEntityOptional = userRepository.findByEmail(email);

                if (userEntityOptional.isPresent() && treeOptional.isPresent()) {
                    Tree tree = treeOptional.get();
                    UserEntity userEntity = userEntityOptional.get();

                    mongoTemplate.update(UserEntity.class)
                            .matching(Criteria.where("email").is(email))
                            .apply(new Update().addToSet("sharedTreeIds").value(tree.getId()))
                            .first();

                    mongoTemplate.update(Tree.class)
                            .matching(Criteria.where("id").is(tree.getId()))
                            .apply(new Update().addToSet("usersAssociated." + toBeAssociatedTree.getRole().toString(), userEntity.getId()))
                            .first();
                }
            }
            pendingUserRepository.delete(pendingUserEntity);
        }
    }
}