import { db } from "../db/index.js";

export async function listEmotions() {
    const result = await db.query(
        "SELECT emotion_id, emotion_name, polarity, strength FROM mst.mst_emotion ORDER BY emotion_id"
    );
    return result.rows;
}
