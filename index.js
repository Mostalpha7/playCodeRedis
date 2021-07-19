require("./startup/db")();
const express = require("express");
const app = express();
const cors = require("cors");
const { Auth } = require("./middlewares/auth");

// Initialize Middlewares
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(express.json({ limit: "100mb", extended: true }));

// Route files
const auth = require("./routes/authRoutes");
const blog = require("./routes/blogRoutes");

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/blog", [Auth], blog);

// Default landing endpoint
app.use("/", (req, res, next) => {
    res.send({ message: "Welcome" });
});

app.listen(1200, console.log("running on port 1200"));