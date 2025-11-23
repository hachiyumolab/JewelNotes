import express from "express";
import { getEmotions } from "../controllers/emotionController.js";

const router = express.Router();

router.get("/", getEmotions);

export default router;
