import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import { paramParser} from "../../middlewares/parsers.middleware.ts";
import {postIdSchema} from "../../dtos/posts.dto.ts";
import {initiator} from "../../server.ts";

const router = Router();

const postController = initiator.getPostController();

router.use(authMiddleware)

router.get(
    "/getPost",
    postController.getPost
)

router.post(
    "/:post_id/Like",
    paramParser(postIdSchema),
    postController.likePost
)
router.post(
    "/:post_id/unLike",
    paramParser(postIdSchema),
    postController.unLikePost
)

router.post(
    "/:post_id/savePost",
    paramParser(postIdSchema),
    postController.savePost
)
router.post(
    "/:post_id/unsavePost",
    paramParser(postIdSchema),
    postController.unsavePost
)

router.use(errorHandler);

export default router;