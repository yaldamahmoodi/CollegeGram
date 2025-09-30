import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {paramParser, queryParser} from "../../middlewares/parsers.middleware.ts";
import {exploreSchema, postIdSchema} from "../../dtos/posts.dto.ts";
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
    "/Like",
    postController.likePost
)

router.post(
    "/savePost",
    postController.savePost
)
router.post(
    "/unsavePost",
    postController.unsavePost
)

router.post(
    "/comment/like",
    postController.likeComment
)
router.post(
    "/comment/unlike",
    
    postController.unlikeComment
)

router.post(
    "/:post_id/unLike",
    paramParser(postIdSchema),
    postController.unLikePost
)

router.get("/explore", queryParser(exploreSchema), postController.explore)

router.get("/mentions", postController.getMentionedPosts)

router.post('/comment', postController.addComment)

router.get('/comments', postController.getComments)

router.use(errorHandler);

export default router;