import * as process from "node:process";

console.log("HELLO")
import express from "express";
import mongoose from "mongoose";
import {json} from "body-parser";
import router from "./routes/user.routes";

const app = express();
app.use(json());

app.use("/api", router);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.log(err));
