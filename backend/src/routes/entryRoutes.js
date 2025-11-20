import express from "express";
import * as entryController from "../controllers/entryController.js";

const router = express.Router();

router.get("/", entryController.getAllEntries);
router.post("/", entryController.postEntry);

export default router;
