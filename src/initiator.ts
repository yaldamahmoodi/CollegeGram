import {authController} from "./controllers/auth.controller.ts";
import {authRepository} from "./repositories/auth.repository.js";
import {authService} from "./services/auth.service.js";

export class Initiator {
    protected authService: authService;
    protected authRepo: authRepository;
    protected authController: authController;

    constructor() {
        this.authRepo = new authRepository();
        this.authService = new authService(this.authRepo);
        this.authController = new authController(this.authService);
    }

    public getUserRepository() {
        return this.authRepo;
    }

    public getUserService() {
        return this.authService;
    }

    public getUserController() {
        return this.authController;
    }
}
