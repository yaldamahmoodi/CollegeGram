import {Router} from "express";
import {Initiator} from "../initiator";

const router = Router();

const initiator = new Initiator();
const userController = initiator.getUserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh-token", userController.refreshToken);


export default router;
