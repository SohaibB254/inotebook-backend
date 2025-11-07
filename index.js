// index.js
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongo();
app.use(cors({
  origin: [
    "http://localhost:5173",   // for local dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("HEyyyy!!!! We are using backend");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 INoteBook backend listening on port ${port}`);
});

