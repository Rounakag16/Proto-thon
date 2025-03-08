const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "Barcode"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("Connected to database");
    }
});

app.get("/api/getData", (req, res) => {
    const serial = req.query.serial;
    db.query("SELECT * FROM products WHERE serial_code = ?", [serial], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(results.length ? results[0] : { message: "No data found" });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});