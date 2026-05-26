const express  = require("express");
const router   = express.Router();
const { pool } = require("../db");

// POST /api/contacts — Save a new contact
router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  // Server-side validation
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "All fields (name, email, phone) are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, phone, created_at`,
      [name.trim(), email.trim().toLowerCase(), phone.trim()]
    );

    return res.status(201).json({
      message: "Contact saved successfully.",
      contact: result.rows[0],
    });
  } catch (err) {
    // Duplicate email
    if (err.code === "23505") {
      return res.status(409).json({ error: "A contact with this email already exists." });
    }
    console.error("DB error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/contacts — Fetch all contacts (optional, useful for testing)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, phone, created_at FROM contacts ORDER BY created_at DESC"
    );
    return res.status(200).json({ contacts: result.rows });
  } catch (err) {
    console.error("DB error:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
