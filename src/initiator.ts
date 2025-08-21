import { UserService} from "./services/user.service";
import {UserRepository} from "./repositories/user.repository";
import {AuthController} from "./controllers/auth.controller";
import {UserController} from "./controllers/user.controller";

export class Initiator {
    protected UserService: UserService;
    protected userRepository: UserRepository;
    protected AuthController: AuthController;
    protected UserController: UserController;

    constructor() {
        this.userRepository = new UserRepository();
        this.UserService = new UserService(this.userRepository);
        this.AuthController = new AuthController(this.UserService);
        this.UserController = new UserController(this.UserService)
    }

    public getUserRepository() {
        return this.userRepository;
    }

    public getUserService() {
        return this.UserService;
    }

    public getAuthController() {
        return this.AuthController;
    }
    public getUserController() {
        return this.UserController;
    }
}
