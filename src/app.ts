import express, {json} from "express";
import mongoose from "mongoose";
import router from "./routes/user.routes";

const app = express();
app.use(json());

app.use("/v1/Auth", router);

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://admin:admin@localhost:27017/collagegram?authSource=admin")
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch(err => console.log(err));
