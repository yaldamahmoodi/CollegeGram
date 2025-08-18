import mongoose from "mongoose";

const connect_db = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/collegegram', {maxPoolSize: 15, minPoolSize: 5});
    } catch (error) {
        console.error('DB connection error: ', error)
        process.exit(1);
    }
}

export {connect_db};