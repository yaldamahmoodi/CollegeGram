import mongoose from "mongoose";
import app from "./server";


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("MongoDB connected");

    })
    .catch(err => console.log(err));


app.listen(PORT, () => console.log(`Server running on ${PORT}`));