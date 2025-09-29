import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import healthRoute from "./routes/health.route.ts";
import authRoute from "./routes/v1/auth.route.ts";
import userRoute from "./routes/v1/user.route.ts";
import postRoute from "./routes/v1/post.route.ts";
import env from "../env.ts";
import path from "path";
import { fileURLToPath } from "node:url";
import searchRoute from "./routes/v1/search.route.ts";
import closeFriendRoute from "./routes/v1/closeFriend.route.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const swaggerDocument = YAML.load(
  path.join(__dirname, "../docs", "swagger.yaml")
);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* ---- GLOBAL MIDDLE WARES ---- */
app.use(express.json());
app.use(helmet());
app.use(cookieParser(env.COOKIE_SECRET));

const allowedOrigins = env.CORS_ORIGIN.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("combined"));

// app.use(
//   "/uploads/profiles",
//   express.static(path.join(__dirname, "middlewares/uploads"), {
//     setHeaders: (res) => {
//       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//       res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0] || "*");
//       res.setHeader("Access-Control-Allow-Methods", "GET");
//       res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//       res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
//     },
//   })
// );
// app.use(
//   "/uploads/posts",
//   express.static(path.join(__dirname, "middlewares/uploads/posts"), {
//     setHeaders: (res) => {
//       res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//       res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0] || "*");
//       res.setHeader("Access-Control-Allow-Methods", "GET");
//       res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//       res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
//     },
//   })
// );

/* ---- ROUTES ---- */
app.use("/api/health", healthRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/closeFriend", closeFriendRoute);

// Uploads are now served directly by nginx at /uploads/ path

export { app };
export default app;
