import express from "express";
import * as entryController from "../controllers/entryController.js";

const router = express.Router();

/* ===================
 * 1. GET /entries
 * =================== */
/**
 * @openapi
 * /api/v1/entries:
 *   get:
 *     summary: Get all entries
 *     description: Retrieve a list of all diary entries.
 *     tags:
 *       - Entries
 *     responses:
 *       200:
 *         description: Successfully retrieved entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Entry"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.get("/", entryController.getAllEntries);


/* ===================
 * 2. POST /entries
 * =================== */
/**
 * @openapi
 * /api/v1/entries:
 *   post:
 *     summary: Create a new entry
 *     tags:
 *       - Entries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EntryCreate"
 *     responses:
 *       201:
 *         description: Entry created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entry"
 *
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BadRequestError"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.post("/", entryController.postEntry);


/* =========================
 * 3. GET /entries/{id}
 * ========================= */
/**
 * @openapi
 * /api/v1/entries/{id}:
 *   get:
 *     summary: Get a single entry by ID
 *     tags:
 *       - Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Entry ID
 *     responses:
 *       200:
 *         description: Entry found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entry"
 *
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.get("/:id", entryController.getEntryById);


/* =========================
 * 4. PUT /entries/{id}
 * ========================= */
/**
 * @openapi
 * /api/v1/entries/{id}:
 *   put:
 *     summary: Update an entry (full update)
 *     tags:
 *       - Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EntryCreate"
 *     responses:
 *       200:
 *         description: Entry updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entry"
 *
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.put("/:id", entryController.putEntry);


/* =========================
 * 5. PATCH /entries/{id}
 * ========================= */
/**
 * @openapi
 * /api/v1/entries/{id}:
 *   patch:
 *     summary: Partially update an entry
 *     tags:
 *       - Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Fields to update (any subset of Entry)
 *     responses:
 *       200:
 *         description: Entry updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Entry"
 *
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.patch("/:id", entryController.patchEntry);


/* =========================
 * 6. DELETE /entries/{id}
 * ========================= */
/**
 * @openapi
 * /api/v1/entries/{id}:
 *   delete:
 *     summary: Delete an entry
 *     tags:
 *       - Entries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Entry ID
 *     responses:
 *       200:
 *         description: Entry deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *       404:
 *         description: Entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ServerError"
 */
router.delete("/:id", entryController.deleteEntry);


export default router;
