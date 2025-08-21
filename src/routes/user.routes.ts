import {Router} from "express";
import {Initiator} from "../initiator";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {uploadProfilePhotoMiddleware} from "../middlewares/uploadProfilePhoto.middleware";

const router = Router();

const initiator = new Initiator();
const userController = initiator.getUserController();

router.patch(
    "/profile/upload",
    AuthMiddleware,
    uploadProfilePhotoMiddleware.single("profile"),
    userController.uploadProfile
);

export default router;