import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";

const router = Router();

const initiator = new Initiator();
const postController = initiator.getPostController();

router.use(authMiddleware)

router.get(
    "/upload",
    postController.getPostByID
)






router.use(errorHandler);

export default router;