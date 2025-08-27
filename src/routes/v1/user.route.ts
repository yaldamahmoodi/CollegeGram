import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";

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
    uploadProfilePhotoMiddleware.single("profile"),
    userController.getUserDetails
);

router.post(
    "/upload/post",
    uploadProfilePhotoMiddleware.array("photos",10),
    userController.createPost
);

router.use(errorHandler);

export default router;