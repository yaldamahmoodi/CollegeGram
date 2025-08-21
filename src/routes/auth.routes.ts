import {Router} from "express";
import {Initiator} from "../initiator";

const router = Router();

const initiator = new Initiator();
const AuthController = initiator.getAuthController();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);


export default router;
