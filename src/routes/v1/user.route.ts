import {Router} from "express";
import {Initiator} from "../../initiator.ts";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {uploadProfilePhotoMiddleware} from "../../middlewares/uploadProfilePhoto.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {bodyParser} from "../../middlewares/parsers.middleware.ts";
import {insertUserSchema} from "../../db/models/user.model.ts";

const router = Router();

const initiator = new Initiator();
const userController = initiator.getUserController();
const optionalUserSchema = insertUserSchema.partial();

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

router.get(
    "/profile/posts",
    userController.getPosts
)

//
// const uuidSchema = z.object({
//     id: z.uuid(),
// })
// router.get(
//     "/post/:id",
//     paramsParser(uuidSchema),
//     userController.getPosts
// )

router.post(
    "/upload/post",
    uploadProfilePhotoMiddleware.array("photos",10),
    userController.createPost
);

router.patch(
    "/profile/update", 
    bodyParser(optionalUserSchema), 
    userController.profileUpdater
);


router.patch(
    "/profile/update",
    bodyParser(optionalUserSchema),
    userController.profileUpdater
);


router.get(
    "/profile/posts",
    userController.getPosts
)

//
// const uuidSchema = z.object({
//     id: z.uuid(),
// })
// router.get(
//     "/post/:id",
//     paramsParser(uuidSchema),
//     userController.getPosts
// )

router.use(errorHandler);

export default router;