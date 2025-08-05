import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import logger from "./middleware/logger";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg) } }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (_req, res): void => {
  res.json("DevConnect api is running...");
});

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      logger.info(`server running on port: http://localhost:${PORT}`)
    );
  } catch (err) {
    const error = err as Error;
    logger.error(error.stack || error.message);
  }
};

startServer();
