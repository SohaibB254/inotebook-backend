// index.js
const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");

const app = express();
const port = 3000;

// Connect to MongoDB
connectToMongo();
// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://inotebookv2.vercel.app/',

];

// Configure CORS dynamically
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

