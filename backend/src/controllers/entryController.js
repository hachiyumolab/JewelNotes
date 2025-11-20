import * as emotionService from "../services/emotionService.js";

export async function getAllEmotions(req, res) {
    try {
        const emotions = await emotionService.listEmotions();
        res.json(emotions);
    } catch (err) {
        console.error("getAllEmotions Error:", err);
        res.status(500).json({ error: "Failed to fetch emotions." });
    }
}
