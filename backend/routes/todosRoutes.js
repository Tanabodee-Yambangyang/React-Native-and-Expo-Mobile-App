import express from "express";
import { sql } from "../config/db.js";

const todosRouter = express.Router()

// api: get one todo
todosRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await sql`
            SELECT * FROM todos WHERE id = ${id}
        `
        res.status(200).json(todo[0]);

    } catch (err) {
        console.log("Error getting the todos list:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// api: add new todo
todosRouter.post("/", async (req, res) => {
    try {
        const { user_id, title, description, due_date } = req.body;
        if (!user_id || !title) {
            return res.status(400).json({ message: "The required fields are missing." });
        }

        const todo = await sql`
            INSERT INTO todos (user_id, title, description, due_date)
            VALUES (${user_id}, ${title}, ${description}, ${due_date})
            RETURNING *
        `
        console.log(todo);
        res.status(201).json(todo[0]);

    } catch (err) {
        console.log("Error adding new todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// api: delete todo
todosRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid todo ID." })
        }

        const result = await sql`
            DELETE FROM todos WHERE id = ${id} RETURNING *
        `
        
        if (result.length === 0) {
            res.status(404).json({ message: "Todo not found" })
        }

        res.status(200).json({ message: "Todo deleted successfully." })

    } catch (err) {
        console.log("Error deleting the todo:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default todosRouter;