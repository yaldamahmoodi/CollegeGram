import {Router} from 'express';


const router = Router();


router.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
        server: "CollegeGram",
        version: "1.0.0"
    })
})

export default router;