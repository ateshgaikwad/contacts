const express        = require("express");
const cors           = require("cors");
require("dotenv").config();

const { initDB }     = require("./db");
const contactsRouter = require("./routes/contacts");

const app  = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

// Routes
app.use("/api/contacts", contactsRouter);

// Health check — Azure App Service pings this
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Start server after DB is ready
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialise database:", err.message);
    process.exit(1);
  });
