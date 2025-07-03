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
        CREATE TABLE IF NOT EXISTS todos (
            id SERIAL PRIMARY KEY,
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
        console.log("Error initializing DB", err);
        process.exit(1) // status code 1 means failure, 0 success
    }
}

app.get("/", (req, res) => {
    res.send("It's working.");
})

// api: add new todo
app.post("/api/todos", async (req, res) => {
    try {
        const {title, description, due_date} = req.body;
        if (!title) {
            return res.status(400).json({message: "Title is required."});
        }

        const todo = await sql`
            INSERT INTO todos (
                title, description, due_date
            )
            VALUES (${title}, ${description}, ${due_date})
            RETURNING *
        `;
        console.log(todo);
        res.status(201).json(todo[0])

    } catch (err) {
        console.log("Error adding new todo:", err);
        res.status(500).json({message: "Internal server error."})
    } 
})

// api: get todos list

// api: get one todo

// api: update todo

// api: delete todo

// initialize
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    })
})

