import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {initiator} from "../../initiator.ts";

const router = Router();

const closeFriendController = initiator.getCloseFriendController();


router.use(authMiddleware)


router.post("/add",
    closeFriendController.addToCloseFriend
);

router.delete("/remove",
    closeFriendController.removeFromCloseFriend
)

router.get('/list',
    closeFriendController.getCloseFriendList
)

router.use(errorHandler);

export default router;