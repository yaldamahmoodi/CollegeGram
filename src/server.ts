import express from "express";
import helmet from "helmet";
import cors from 'cors'
import morgan from 'morgan'

import healthRoute from "./routes/health.route.ts";
import authRoute from "./routes/v1/auth.route.ts"

const app = express();


/* ---- GLOBAL MIDDLE WARES ---- */
app.use(helmet());
app.use(cors())
app.use(morgan("combined"))
app.use(express.json());


/* ---- ROUTES ---- */
app.use("/api/health", healthRoute)
app.use("/api/v1/auth", authRoute);


export {app};
export default app;
