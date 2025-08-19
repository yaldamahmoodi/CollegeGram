import {Router} from "express";
import {Initiator} from "../../initiator.ts";

const router = Router();
const initiator = new Initiator();
const userController = initiator.getUserController();

router.post("/register", userController.register);
router.post("/login", userController.login);

export default router;


