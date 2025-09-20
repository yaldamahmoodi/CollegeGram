import {Router} from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.ts";
import {errorHandler} from "../../middlewares/error.middleware.ts";
import {initiator} from "../../server.ts";

const router = Router();

const searchController = initiator.getSearchController();

router.use(authMiddleware)

router.get(
    "/getUsers/:page_number",
    searchController.userSearch
)
router.get(
    "/getUsers/:page_number/:query",
    searchController.userSearch
)
router.use(errorHandler);

export default router;