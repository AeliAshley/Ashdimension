const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Secret is stored securely in Render
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

// Render provides PORT automatically.
// 3000 is used when running locally.
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// ========================================
// VERIFY LOGIN TOKEN
// ========================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please log in."
        });
    }

    jwt.verify(
        token,
        JWT_SECRET,
        function (error, user) {

            if (error) {
                return res.status(403).json({
                    message: "Invalid or expired token"
                });
            }

            req.user = user;

            next();
        }
    );
}


// ========================================
// HOME
// ========================================

app.get("/", function (req, res) {
    res.send("My backend is working!");
});


// ========================================
// GET TASKS
// Load tasks for logged-in user
// ========================================

app.get("/api/tasks", authenticateToken, function (req, res) {

    const userId = req.user.id;

    const sql =
        "SELECT * FROM tasks WHERE user_id = ?";

    db.query(sql, [userId], function (error, results) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});


// ========================================
// POST TASK
// Add task to database
// ========================================

app.post("/api/tasks", authenticateToken, function (req, res) {

    const taskName = req.body.name;
    const userId = req.user.id;
    const dueDate = req.body.due_date || null;

    if (!taskName) {
        return res.status(400).json({
            message: "Task name is required"
        });
    }

    const sql =
        "INSERT INTO tasks (name, completed, user_id, due_date) VALUES (?, false, ?, ?)";

    db.query(
        sql,
        [taskName, userId, dueDate],
        function (error, result) {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                id: result.insertId,
                name: taskName,
                completed: false,
                user_id: userId,
                due_date: dueDate
            });
        }
    );
});


// ========================================
// PUT TASK
// Complete / uncomplete task
// ========================================

app.put("/api/tasks/:id", authenticateToken, function (req, res) {

    const taskId = req.params.id;
    const userId = req.user.id;
    const completed = req.body.completed;

    const sql =
        "UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?";

    db.query(
        sql,
        [completed, taskId, userId],
        function (error, result) {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.json({
                message: "Task updated"
            });
        }
    );
});


// ========================================
// DELETE TASK
// ========================================

app.delete("/api/tasks/:id", authenticateToken, function (req, res) {

    const taskId = req.params.id;
    const userId = req.user.id;

    const sql =
        "DELETE FROM tasks WHERE id = ? AND user_id = ?";

    db.query(
        sql,
        [taskId, userId],
        function (error, result) {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.json({
                message: "Task deleted"
            });
        }
    );
});


// ========================================
// REGISTER
// Create a new user
// ========================================

app.post("/api/register", async function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Make sure all fields were provided
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill in all fields"
        });
    }

    try {

        // Hash the password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(
            sql,
            [name, email, hashedPassword],
            function (error, result) {

                if (error) {
                    console.log(error);

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                res.status(201).json({
                    message: "User registered successfully",
                    userId: result.insertId
                });
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ========================================
// LOGIN
// Check user email and password
// ========================================

app.post("/api/login", function (req, res) {

    const email = req.body.email;
    const password = req.body.password;

    // Make sure both fields were provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password"
        });
    }

    // Find the user by email
    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async function (error, results) {

        if (error) {
            console.log(error);

            return res.status(500).json({
                message: "Database error"
            });
        }

        // No account with this email
        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        // Compare entered password with hashed password
        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create login token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        // Login successful
        res.json({
            message: "Login successful",

            token: token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, function () {
    console.log("Server is running on port " + PORT);
});