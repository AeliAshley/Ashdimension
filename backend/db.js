const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect(function (error) {
    if (error) {
        console.log("Database connection failed:");
        console.log(error);
        return;
    }

    console.log("Connected to the database!");
});

module.exports = db;