import mongoose from "mongoose";
import logger from "../middleware/logger";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI is not defined in enviroment variable");

    mongoose.connect(mongoURI);
    logger.info("Connected to MongoDB");
  } catch (err: unknown) {
    if (err instanceof Error) logger.error(`Connection Error: ${err.stack || err.message}`);
    else logger.error("Unknown error occured");
    process.exit(1);
  }
}

export default connectDB;