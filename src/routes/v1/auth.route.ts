import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {insertUserSchema} from "../../db/models/user.model.ts";

const router = Router();
const initiator = new Initiator();
const userController = initiator.getUserController();

router.post("/register", bodyParser(insertUserSchema), userController.register);
router.post("/login", userController.login);

export default router;


