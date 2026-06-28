require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 
const aiRoutes = require("./routes/aiRoutes");

const app = express();

if (process.env.ATLASDB_URL) {
  process.env.MONGO_URI = process.env.ATLASDB_URL;
}
connectDB(); 

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  frontendUrl 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Blocked: Origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Emergency Room Backend is Running!");
});

app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL SERVER ERROR:", err.message);
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      success: false,
      message: err.message
    });
  }
  res.status(500).json({ 
    success: false, 
    message: "Internal Server Error",
    error: err.message
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 SERVER RUNNING PROUDLY ON PORT: ${PORT}`);
  console.log(`🛡️ GLOBAL FAIL-SAFE MATRIX: ACTIVE`);
  console.log(`=============================================`);
});