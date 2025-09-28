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

    constructor() {
        this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        this.postRepository = new PostRepository();
        this.saveRepository = new SaveRepository();
        this.profileRepository = new ProfileRepository();
        this.followRepository = new FollowRepository()
        this.commentRepository = new CommentRepository();
        this.notificationRepository = new NotificationRepository();
        this.webSocketService = new WebSocketService();

        this.elasticClient = new ElasticClient();
        this.searchIndexManager = new SearchIndexManager(this.elasticClient);
    }


    public setupServices(): void {
        this.authService = new AuthService(this.authRepository);
        this.notificationService = new NotificationService(this.notificationRepository, this.webSocketService);
        this.userService = new UserService(this.userRepository, this.profileRepository, this.followRepository, this.notificationService);
        this.postService = new PostService(this.postRepository, this.saveRepository, this.commentRepository, this.notificationService);
        this.userSearchService = new UserSearchService(this.elasticClient);
        this.commentService = new CommentService(this.postRepository, this.commentRepository);

    }

    public setupControllers(): void {
        this.authController = new AuthController(this.authService);
        this.userController = new UserController(this.userService, this.postService);
        this.postController = new PostController(this.postService, this.commentService);
        this.searchController = new SearchController(this.userSearchService);
        this.notificationController = new NotificationController(this.notificationService);

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

    public getNotificationController() {
        return this.notificationController;
    }
}
