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


    constructor() {
        this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        this.postRepository = new PostRepository();
        this.saveRepository = new SaveRepository();
        this.profileRepository = new ProfileRepository();
    }

    public setupServices(): void {
        this.authService = new AuthService(this.authRepository);
        this.userService = new UserService(this.userRepository, this.profileRepository, this.postRepository);
        this.postService = new PostService(this.postRepository, this.saveRepository);
    }

    public setupControllers(): void {
        this.authController = new AuthController(this.authService);
        this.userController = new UserController(this.userService, this.postService);
        this.postController = new PostController(this.postService);
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
}
