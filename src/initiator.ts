import {UserService} from "./services/user.service.ts";
import {UserRepository} from "./repositories/user.repository.ts";
import {AuthController} from "./controllers/auth.controller.ts";
import {UserController} from "./controllers/user.controller.ts";
import {AuthService} from "./services/auth.service.ts";
import {AuthRepository} from "./repositories/auth.repository.ts";
import {PostRepository} from "./repositories/post.repository.ts";
import {ProfileRepository} from "./repositories/profile.repository.ts";


export class Initiator {
    protected userService: UserService;
    protected userRepository: UserRepository;
    protected authController: AuthController;
    protected authService: AuthService;
    protected userController: UserController;
    protected authRepository: AuthRepository;
    protected postRepository: PostRepository;
    protected profileRepository: ProfileRepository


    constructor() {
        this.userRepository = new UserRepository();
        this.authRepository = new AuthRepository();
        this.postRepository = new PostRepository();
        this.profileRepository = new ProfileRepository();
        this.authService = new AuthService(this.authRepository);
        this.userService = new UserService(this.userRepository, this.profileRepository, this.postRepository);
        this.authController = new AuthController(this.authService);
        this.userController = new UserController(this.userService)
    }

    public getAuthController() {
        return this.authController;
    }

    public getUserController() {
        return this.userController;
    }
}
