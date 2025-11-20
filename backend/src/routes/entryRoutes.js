import express from "express";
import * as entryController from "../controllers/entryController.js";

const router = express.Router();

// A: GET list
router.get("/", entryController.getAllEntries);

// B: POST create
router.post("/", entryController.postEntry);

// C: GET one
router.get("/:id", entryController.getEntryById);

// D: PUT full update
router.put("/:id", entryController.putEntry);

// E: PATCH partial update
router.patch("/:id", entryController.patchEntry);

// F: DELETE
router.delete("/:id", entryController.deleteEntry);

export default router;
