import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./v1/db/index.js";

import entryRoutes from "./v1/routes/entryRoutes.js";
import emotionRoutes from "./v1/routes/emotionRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

// DB
connectDB();

// v1 API
app.use("/api/v1/entries", entryRoutes);
app.use("/api/v1/emotions", emotionRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export default app;
