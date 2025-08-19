import {UserService} from "./services/user.service";
import {UserRepository} from "./repositories/user.repository";
import {UserController} from "./controllers/user.controller";

export class Initiator {
    protected userService: UserService;
    protected userRepository: UserRepository;
    protected userController: UserController;

    constructor() {
        this.userRepository = new UserRepository();
        this.userService = new UserService(this.userRepository);
        this.userController = new UserController(this.userService);
    }

    public getUserRepository() {
        return this.userRepository;
    }

    public getUserService() {
        return this.userService;
    }

    public getUserController() {
        return this.userController;
    }
}
