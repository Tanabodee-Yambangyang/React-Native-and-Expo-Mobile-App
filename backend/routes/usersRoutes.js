import express from "express";
import { sql } from "../config/db.js";

const usersRouter = express.Router()

// api: get todos list by user
usersRouter.get("/:user_id/todos", async (req, res) => {
    try {
        const { user_id } = req.params;

        const todos = await sql`
            SELECT * FROM todos WHERE user_id = ${user_id} ORDER BY created_at DESC
        `
        res.status(200).json(todos);

    } catch (err) {
        console.log("Error getting the todos list:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

// api: registration
usersRouter.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const password_hash = password;

        const user = await sql`
            INSERT INTO users (email, password_hash)
            VALUES (${email}, ${password_hash})
            RETURNING id, email, created_at
        `
        console.log(user);
        res.status(201).json(user[0]);

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default usersRouter;