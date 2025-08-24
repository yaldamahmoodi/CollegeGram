import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {insertUserSchema} from "../../db/models/user.model.ts";

const router = Router();
const initiator = new Initiator();
const authController = initiator.getAuthController();

router.post("/register", bodyParser(insertUserSchema), authController.register);
router.post("/login", authController.login);

export default router;


