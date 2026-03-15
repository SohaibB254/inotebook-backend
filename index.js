// index.js
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

const app = express();
const port = 3000;

// Connect to MongoDB
connectToMongo();


// Configure CORS dynamically
app.use(cors({
  origin: ['http://localhost:3000','https://inotebookv2.vercel.app'],
  credentials: true // if you need cookies or auth headers
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

