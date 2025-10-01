import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {initiator} from "../../server.ts";

const router = Router();

const searchController = initiator.getSearchController();

router.use(authMiddleware)

router.get(
    "/getUsers/:page_number/{:query}",
    searchController.userSearch
)

router.get(
    "/getPosts/:page_number/{:query}",
    searchController.postSearch
)

router.use(errorHandler);

export default router;