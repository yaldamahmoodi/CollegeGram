import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {insertUserSchema} from "../../db/models/user.model.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts"
import {loginDTO} from "../../dtos/login.dto.ts";


const router = Router();
const initiator = new Initiator();
const authController = initiator.getAuthController;

router.post("/register", bodyParser(insertUserSchema), authController.register);
router.post("/login", bodyParser(loginDTO), authController.login);

router.use(errorHandler);

export default router;


