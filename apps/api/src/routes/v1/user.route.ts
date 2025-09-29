import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {updateProfileUserSchema} from "../../db/models/user.model.ts";
import {initiator} from "../../server.ts";
import {uploadPostPhotosMiddleware} from "../../middlewares/uploadPost.middleware.ts";
import {followSchema, acceptFollowRequestSchema, rejectFollowRequestSchema} from "../../dtos/user.dto.ts";

const router = Router();

const userController = initiator.getUserController();


router.use(authMiddleware)

router.post(
    "/profile/upload",
    uploadProfilePhotoMiddleware.single("profile"),
    userController.uploadProfile
);

router.get(
    "/profile",
    userController.getProfile
);

router.post(
    "/upload/post",
    uploadPostPhotosMiddleware.array("photos", 10),
    userController.createPost
);


router.patch(
    "/profile/update",
    bodyParser(updateProfileUserSchema),
    userController.updateProfile
);

router.post(
    "/follow",
    bodyParser(followSchema),
    userController.followUser
);

router.post(
    "/unfollow",
    bodyParser(followSchema),
    userController.unfollowUser
);

router.post(
    "/accept-follow-request",
    bodyParser(acceptFollowRequestSchema),
    userController.acceptFollowRequest
);

router.post(
    "/reject-follow-request",
    bodyParser(rejectFollowRequestSchema),
    userController.rejectFollowRequest
);

router.get(
    '/savesList',
    userController.getUserSavesList
)

router.get(
    "/followers",
    userController.getFollowersList
)

router.get(
    "/followings",
    userController.getFollowingsList
)

router.post(
    "/block",
    userController.BlockUser
);

router.post(
    "/unblock",
    userController.unBlockUser
);


router.get(
    "/:username",
    userController.getOtherProfile
);



router.use(errorHandler);

export default router;