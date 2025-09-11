import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import YAML from "yamljs"
import swaggerUi from "swagger-ui-express"
import healthRoute from "./routes/health.route.ts";
import authRoute from "./routes/v1/auth.route.ts"
import userRoute from "./routes/v1/user.route.ts";
import postRoute from "./routes/v1/post.route.ts";
import env from "../env.ts";
import path from "path";
import {fileURLToPath} from "node:url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, "../docs", "swagger.yaml"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(cookieParser(env.COOKIE_SECRET));


/* ---- GLOBAL MIDDLE WARES ---- */
app.use(helmet());

const allowedOrigins = env.CORS_ORIGIN.split(",");
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // برای Postman یا سرور بدون origin
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(morgan("combined"))
app.use(express.json());


/* ---- ROUTES ---- */
app.use("/api/health", healthRoute)
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);


export {app};
export default app;
