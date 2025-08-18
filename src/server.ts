import express from "express";
import helmet from "helmet";
import cors from 'cors'
import morgan from 'morgan'

import router from "./routes/user.routes";
import healthRoute from "./routes/health.route";

const app = express();


/* ---- GLOBAL MIDDLE WARES ---- */
app.use(helmet());
app.use(cors())
app.use(morgan("combined"))
app.use(express.json());


/* ---- ROUTES ---- */
app.use("/api/health", healthRoute)
app.use("/api", router);


export {app};
export default app;
