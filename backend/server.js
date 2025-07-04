import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express()

// middleware
app.use(express.json());

const PORT = process.env.PORT || 5001;
// connectDB(process.env.DATABASE_URL);

// create a database
const initDB = async () => {
    try {
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        is_done BOOLEAN NOT NULL DEFAULT FALSE,
        due_date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT NULL
      )
    `;

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Error initializing DB:", err);
        process.exit(1);
    }
};

app.get("/", (req, res) => {
    res.send("It's working.");
});

// api: get todos list by user
app.get("/api/users/:user_id/todos", async (req, res) => {
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

// api: get one todo
app.get("/api/todos/:id", async (req, res) => {
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
app.post("/api/todos", async (req, res) => {
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

// api: registration
app.post("/api/users", async (req, res) => {
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

// api: update todo

// api: delete todo
app.delete("/api/todos/:id", async (req, res) => {
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

// initialize
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    });
});

