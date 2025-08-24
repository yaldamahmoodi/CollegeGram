import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {AuthMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";

const router = Router();

const initiator = new Initiator();
const userController = initiator.getUserController();

router.post(
    "/profile/upload",
    AuthMiddleware,
    uploadProfilePhotoMiddleware.single("profile"),
    userController.uploadProfile
);

app.use(errorHandler);

export default router;