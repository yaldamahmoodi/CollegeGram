import {Router} from "express";
import {UserController} from "../../controllers/auth.controller.ts";
import {UserService} from "../../services/auth.service.ts";
import {AuthRepository} from "../../repositories/auth.repository.ts";

const router = Router();
const userController = new UserController(new UserService(new AuthRepository()));

router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;


