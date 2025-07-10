import express from "express";
import { sql } from "../config/db.js";

const usersRouter = express.Router();

// ─────────────────────────────
// GET /:user_id/todos → all todos
// ─────────────────────────────
usersRouter.get("/:user_id/todos", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || isNaN(Number(user_id))) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const todos = await sql`
      SELECT * FROM todos
      WHERE user_id = ${user_id}
      ORDER BY due_time ASC NULLS LAST
    `;

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error getting the todos list:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ─────────────────────────────
// GET /:user_id/todos/date/:date → todos for date
// ─────────────────────────────
usersRouter.get("/:user_id/todos/date/:date", async (req, res) => {
  try {
    const { user_id, date } = req.params;

    if (!user_id || !date) {
      return res.status(400).json({ message: "User ID and date are required." });
    }

    if (isNaN(Number(user_id))) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    const todos = await sql`
      SELECT * FROM todos
      WHERE user_id = ${user_id}
        AND DATE(created_at) = ${date}
      ORDER BY due_time ASC NULLS LAST
    `;

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error getting todos by date:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ─────────────────────────────
// POST / → register user (For test purpose only.)
// ─────────────────────────────
usersRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const password_hash = password; // NOTE: Replace with real hashing in production

    const user = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${email}, ${password_hash})
      RETURNING id, email, created_at
    `;

    res.status(201).json(user[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default usersRouter;