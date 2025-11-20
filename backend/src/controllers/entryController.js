// src/controllers/entryController.js

import * as entryService from "../services/entryService.js";

/* A: get list */
export async function getAllEntries(req, res) {
    try {
        const entries = await entryService.listEntries();
        res.json(entries);
    } catch (err) {
        console.error("getAllEntries Error:", err);
        res.status(500).json({ error: "Failed to fetch entries" });
    }
}

/* C: get one */
export async function getEntryById(req, res) {
    try {
        const id = Number(req.params.id);
        const entry = await entryService.getEntry(id);

        if (!entry) return res.status(404).json({ error: "Entry not found" });

        res.json(entry);
    } catch (err) {
        console.error("getEntryById Error:", err);
        res.status(500).json({ error: "Failed to fetch entry" });
    }
}

/* B: create */
export async function postEntry(req, res) {
    try {
        const entry = await entryService.createEntry(req.body);
        res.status(201).json(entry);
    } catch (err) {
        console.error("postEntry Error:", err);
        res.status(500).json({ error: "Failed to create entry" });
    }
}

/* D: PUT full update */
export async function putEntry(req, res) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const updated = await entryService.updateEntryFull(id, data);

        if (!updated) return res.status(404).json({ error: "Entry not found" });

        res.json(updated);
    } catch (err) {
        console.error("putEntry Error:", err);
        res.status(500).json({ error: "Failed to update entry" });
    }
}

/* E: PATCH partial update */
export async function patchEntry(req, res) {
    try {
        const id = Number(req.params.id);
        const data = req.body;

        const updated = await entryService.updateEntryPartial(id, data);

        if (!updated) return res.status(404).json({ error: "Entry not found" });

        res.json(updated);
    } catch (err) {
        console.error("patchEntry Error:", err);
        res.status(500).json({ error: "Failed to patch entry" });
    }
}

/* F: DELETE */
export async function deleteEntry(req, res) {
    try {
        const id = Number(req.params.id);
        const deleted = await entryService.deleteEntry(id);

        if (!deleted) return res.status(404).json({ error: "Entry not found" });

        res.json({ success: true });
    } catch (err) {
        console.error("deleteEntry Error:", err);
        res.status(500).json({ error: "Failed to delete entry" });
    }
}

