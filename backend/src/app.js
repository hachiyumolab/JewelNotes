import "dotenv/config";
import express from "express";
import { connectDB } from "./db/index.js";

import emotionRoutes from "./routes/emotionRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";

const app = express();
app.use(express.json());

await connectDB();

app.use("/emotions", emotionRoutes);
app.use("/entries", entryRoutes);

app.get("/", (req, res) => {
    res.send("JewelNotes API running.");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
