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
import {NotificationRepository} from "./repositories/notification.repository.ts";
import {NotificationService} from "./services/notification.service.ts";
import {NotificationController} from "./controllers/notification.controller.ts";
import {WebSocketService} from "./services/websocket.service.ts";
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
    public notificationRepository: NotificationRepository;
    public notificationService: NotificationService;
    public notificationController: NotificationController;
    public webSocketService: WebSocketService;
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

    private initialized: boolean = false;


    constructor() {
        this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        this.postRepository = new PostRepository();
        this.saveRepository = new SaveRepository();
        this.profileRepository = new ProfileRepository();
        this.followRepository = new FollowRepository()
        this.commentRepository = new CommentRepository();
        this.blockRepository = new BlockRepository()
        this.notificationRepository = new NotificationRepository();
        this.webSocketService = new WebSocketService();

        this.elasticClient = new ElasticClient();
        this.searchIndexManager = new SearchIndexManager(this.elasticClient);

        this.closeFriendRepository = new CloseFriendRepository();
    }


    public setupServices(): void {
        this.authService = new AuthService(this.authRepository);
        this.notificationService = new NotificationService(this.notificationRepository, this.webSocketService);
        this.userService = new UserService(this.userRepository, this.profileRepository, this.followRepository , this.blockRepository, this.closeFriendRepository, this.notificationService);
        this.postService = new PostService(this.postRepository, this.saveRepository, this.commentRepository, this.notificationService);
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
        this.notificationController = new NotificationController(this.notificationService);
        this.closeFriendController = new CloseFriendController(this.closeFriendService);
        this.initialized = true;
    }

    private ensureInitialized(): void {
        if (!this.initialized) {
            this.setupServices();
            this.setupControllers();
        }
    }

    public getAuthController() {
        this.ensureInitialized();
        return this.authController;
    }

    public getUserController() {
        this.ensureInitialized();
        return this.userController;
    }


    public getPostController() {
        this.ensureInitialized();
        return this.postController;
    }

    public getSearchController() {
        this.ensureInitialized();
        return this.searchController;
    }

    public getNotificationController() {
        this.ensureInitialized();
        return this.notificationController;
    }
    
    public getCloseFriendController() {
        this.ensureInitialized();
        return this.closeFriendController;
    }
}

// Export a singleton to be used across the app without importing from server.ts
export const initiator = new Initiator();
