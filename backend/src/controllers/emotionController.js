import { listEmotions } from "../services/emotionService.js";

export async function getEmotions(req, res) {
    try {
        const rows = await listEmotions();
        res.json(rows);
    } catch (err) {
        console.error("getEmotions error:", err);
        res.status(500).json({ error: "Failed to fetch emotions." });
    }
}
