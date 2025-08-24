import mongoose from "mongoose";
import env from "../../env.ts";


export class Database {

    private static instance: Database;

    private constructor() {
    }


    private timeoutPromise(timeoutMs: number) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Database connection timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        })
    }

    private async connect_db(attempts: number = 0) {
        const maxRetries = 5;
        const timeoutMs = 10000;

        try {
            await Promise.race([
                mongoose.connect(env.MONGODB_URI, {maxPoolSize: env.MAX_POOL_SIZE, minPoolSize: env.MIN_POOL_SIZE}),
                this.timeoutPromise(timeoutMs)
            ]);
            if (mongoose.connection.readyState !== 1) {
                throw new Error("Failed to connect to MongoDB.");
            }
            console.log("Successfully connected to MongoDB!");
        } catch (error) {
            attempts++;
            console.error(`DB connection attempt ${attempts} failed: `, error);

            if (attempts >= maxRetries) {
                console.error("Max retries reached, exiting application...");
                process.exit(1);
            } else {
                console.log(`Retrying in 3 seconds...`);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                await this.connect_db(attempts);
            }
        }
    }

    static async getInstance(): Promise<Database> {
        if (!Database.instance) {
            Database.instance = new Database();
            await this.connect_db()
        }
        return Database.instance;
    }


}


