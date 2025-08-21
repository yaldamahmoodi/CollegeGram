import express, {json} from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
dotenv.config();


const app = express();
app.use(json());

app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);


const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://admin:admin@localhost:27017/collagegram?authSource=admin")
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.log(err));
