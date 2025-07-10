import express from "express";
import { sql } from "../config/db.js";
import dayjs from "dayjs";

const todosRouter = express.Router();

// ─────────────────────────────────────────────
// GET /:id → Get a single todo
// ─────────────────────────────────────────────
todosRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "Valid todo ID is required." });
        }

        const todo = await sql`SELECT * FROM todos WHERE id = ${id}`;

        if (todo.length === 0) {
            return res.status(404).json({ message: "Todo not found." });
        }

        res.status(200).json(todo[0]);
    } catch (err) {
        console.error("Error fetching todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ─────────────────────────────────────────────
// POST / → Add a new todo
// ─────────────────────────────────────────────
todosRouter.post("/", async (req, res) => {
    try {
        const { user_id, title, description, due_time } = req.body;
        const now = dayjs();
        const createdAt = now.toISOString();

        if (!user_id || !title) {
            return res.status(400).json({ message: "user_id and title are required." });
        }

        const todo = await sql`
      INSERT INTO todos (user_id, title, description, created_at, due_time)
      VALUES (${user_id}, ${title}, ${description}, ${createdAt}, ${due_time})
      RETURNING *
    `;

        res.status(201).json(todo[0]);
    } catch (err) {
        console.error("Error adding new todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ─────────────────────────────────────────────
// DELETE /:id → Delete a todo
// ─────────────────────────────────────────────
todosRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "Valid todo ID is required." });
        }

        const result = await sql`DELETE FROM todos WHERE id = ${id} RETURNING *`;

        if (result.length === 0) {
            return res.status(404).json({ message: "Todo not found." });
        }

        res.status(200).json({ message: "Todo deleted successfully.", todo: result[0] });
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// ─────────────────────────────────────────────
// PUT /:id → Update a todo
// ─────────────────────────────────────────────
todosRouter.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, is_done, due_time } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "Valid todo ID is required." });
        }

        const fields = [];
        const values = [];

        if (title !== undefined) {
            fields.push('title');
            values.push(title);
        }
        if (description !== undefined) {
            fields.push('description');
            values.push(description);
        }
        if (is_done !== undefined) {
            fields.push('is_done');
            values.push(is_done);
        }
        if (due_time !== undefined) {
            fields.push('due_time');
            values.push(due_time);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields to update." });
        }

        const setClause = fields.map((field, idx) => `${field} = $${idx + 1}`).join(", ");

        const query = `
            UPDATE todos
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $${values.length + 1}
            RETURNING *
        `;

        values.push(id);

        const result = await sql.query(query, values);

        if (result.length === 0) {
            return res.status(404).json({ message: "Todo not found." });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});


export default todosRouter;