import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import { paramParser} from "../../middlewares/parsers.middleware.ts";
import {postIdSchema} from "../../dtos/posts.dto.ts";
import {initiator} from "../../server.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";

const router = Router();

const postController = initiator.getPostController();

router.use(authMiddleware)


router.get(
    "/:post_id/getPost",
    postController.getPost
)

router.get(
    "/getPosts",
    postController.getPosts
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
    "/savePost",
    postController.savePost
)
router.post(
    "/unsavePost",
    postController.unsavePost
)

router.use(errorHandler);

export default router;