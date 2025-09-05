import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {updateProfileUserSchema} from "../../db/models/user.model.ts";
import {insertPostSchema} from "../../db/models/post.model.js";

const router = Router();

const initiator = new Initiator();
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

router.get(
    "/profile/posts",
    userController.getPosts
)


router.post(
    "/upload/post",
    bodyParser(insertPostSchema),
    uploadProfilePhotoMiddleware.array("photos", 10),
    userController.createPost
);


router.patch(
    "/profile/update",
    bodyParser(updateProfileUserSchema),
    userController.updateProfile
);


router.use(errorHandler);

export default router;