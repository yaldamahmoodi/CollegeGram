import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {updateProfileUserSchema} from "../../db/models/user.model.ts";
import {initiator} from "../../server.ts";

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
    userController.getUserDetails
);

router.patch(
    "/profile/update",
    bodyParser(updateProfileUserSchema),
    userController.updateProfile
);

router.post(
    "/follow",
    userController.followUser
);

router.post(
    "/unfollow",
    userController.unfollowUser
);

router.use(errorHandler);

export default router;