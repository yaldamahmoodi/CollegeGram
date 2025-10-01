import {UserService} from "./services/user.service.ts";
import {UserRepository} from "./repositories/user.repository.ts";
import {AuthController} from "./controllers/auth.controller.ts";
import {UserController} from "./controllers/user.controller.ts";
import {AuthService} from "./services/auth.service.ts";
import {AuthRepository} from "./repositories/auth.repository.ts";
import {PostRepository} from "./repositories/post.repository.ts";
import {ProfileRepository} from "./repositories/profile.repository.ts";
import {PostController} from "./controllers/post.controller.ts";
import {PostService} from "./services/post.service.ts";
import {SaveRepository} from "./repositories/save.repository.ts";
import {ElasticClient} from "./services/elasticClient.service.ts";
import {SearchIndexManager} from "./services/SearchIndexManager.service.ts";
import {SearchController} from "./controllers/search.controller.ts";
import {UserSearchService} from "./services/UserSearchService.ts";
import {FollowRepository} from "./repositories/follow.repository.ts";
import {CommentRepository} from "./repositories/comment.repository.ts";
import {CommentService} from "./services/comment.service.ts";
import {BlockRepository} from "./repositories/block.repository.ts";
import {CloseFriendController} from "./controllers/closefriend.controller.ts";
import {CloseFriendRepository} from "./repositories/closefriend.repository.ts";
import {CloseFriendService} from "./services/closefriend.service.ts";
import {PostSearchService} from "./services/PostSearchService.ts"


export class Initiator {
    public userService: UserService;
    public userRepository: UserRepository;
    public authController: AuthController;
    public authService: AuthService;
    public userController: UserController;
    public authRepository: AuthRepository;
    public postRepository: PostRepository;
    public profileRepository: ProfileRepository
    public postService: PostService;
    public postController: PostController;
    public saveRepository: SaveRepository;
    public followRepository: FollowRepository;
    public commentRepository: CommentRepository;
    public commentService: CommentService;

    public elasticClient: ElasticClient;
    public searchIndexManager: SearchIndexManager;
    public searchController: SearchController;
    public userSearchService: UserSearchService;
    public blockRepository: BlockRepository
    public closeFriendController: CloseFriendController;
    public closeFriendRepository: CloseFriendRepository;
    public closeFriendService: CloseFriendService;
    public postSearchService: PostSearchService;


    constructor() {
        this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        this.postRepository = new PostRepository();
        this.saveRepository = new SaveRepository();
        this.profileRepository = new ProfileRepository();
        this.followRepository = new FollowRepository()
        this.commentRepository = new CommentRepository();
        this.blockRepository = new BlockRepository()

        this.elasticClient = new ElasticClient();
        this.searchIndexManager = new SearchIndexManager(this.elasticClient);

        this.closeFriendRepository = new CloseFriendRepository();
    }


    public setupServices(): void {
        this.authService = new AuthService(this.authRepository);
        this.userService = new UserService(this.userRepository, this.profileRepository, this.followRepository , this.blockRepository, this.closeFriendRepository);
        this.postService = new PostService(this.postRepository, this.saveRepository);
        this.userSearchService = new UserSearchService(this.elasticClient, this.blockRepository);
        this.commentService = new CommentService(this.postRepository, this.commentRepository);
        this.closeFriendService = new CloseFriendService(this.closeFriendRepository);
        this.postSearchService = new PostSearchService(this.elasticClient, this.blockRepository);

    }

    public setupControllers(): void {
        this.authController = new AuthController(this.authService);
        this.userController = new UserController(this.userService, this.postService);
        this.postController = new PostController(this.postService, this.commentService);
        this.searchController = new SearchController(this.userSearchService,this.postSearchService);
        this.closeFriendController = new CloseFriendController(this.closeFriendService);
    }

    public getAuthController() {
        return this.authController;
    }

    public getUserController() {
        return this.userController;
    }


    public getPostController() {
        return this.postController;
    }

    public getSearchController() {
        return this.searchController;
    }

    public getCloseFriendController() {
        return this.closeFriendController;
    }
}
