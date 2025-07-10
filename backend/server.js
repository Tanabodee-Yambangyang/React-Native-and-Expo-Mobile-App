import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js"

import todosRouter from "./routes/todosRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
 
dotenv.config();

const app = express()

// middleware
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;
// connectDB(process.env.DATABASE_URL);
 
app.use("/api/todos", todosRouter);
app.use("/api/users", usersRouter);

// initialize
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    });
});

