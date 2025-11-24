import express from "express";
import * as entryController from "../controllers/entryController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Entries
 *   description: Entry Management
 *
 * /api/v1/entries:
 *   get:
 *     summary: Get all entries
 *     tags: [Entries]
 *     responses:
 *       200:
 *         description: List of entries
 */

// GET all
router.get("/", entryController.getAllEntries);

// POST create
router.post("/", entryController.postEntry);

// GET one
router.get("/:id", entryController.getEntryById);

// PUT full update
router.put("/:id", entryController.putEntry);

// PATCH partial update
router.patch("/:id", entryController.patchEntry);

// DELETE
router.delete("/:id", entryController.deleteEntry);

export default router;
