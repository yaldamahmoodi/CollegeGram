import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import env from "../env.ts";

import healthRoute from "./routes/health.route.ts";
import authRoute from "./routes/v1/auth.route.ts"
import userRoute from "./routes/v1/user.route.ts";
import postRoute from "./routes/v1/post.route.ts";

const app = express();

app.use(cookieParser(env.COOKIE_SECRET));
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan("combined"));
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);

export default app;
