import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import emailjs from "@emailjs/nodejs";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = { origin: "*", methods: ["*"] };
let COUNT = 0;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/customerfeedback")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Review Schema & Model
const reviewSchema = new mongoose.Schema({
    experience: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    accommodation: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    transport: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    guides: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    food: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    cost: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    cleanliness: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    safety: { type: String, enum: ["Very Good", "Good", "Fair", "Poor", "Very Poor"], required: true },
    favorite: { type: String, required: true },
    suggestions: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model("Review", reviewSchema);

// Middleware
app.set("getPort", process.env.PORT || 8080);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/public/", express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

// Custom Error Handler
class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}

// Async Error Wrapper
function wrapAround(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Routes
app.get("/", (req, res) => {
    COUNT++;
    res.render("index.ejs", { count: COUNT });
});

// Feedback Form Route
app.get('/review', (req, res) => {
    res.render('review'); // No need to add .ejs
});

// Submit Feedback Route
app.post("/post", wrapAround(async (req, res) => {
    const { experience, accommodation, transport, guides, food, cost, cleanliness, safety, favorite, suggestions } = req.body;

    const review = new Review({ experience, accommodation, transport, guides, food, cost, cleanliness, safety, favorite, suggestions });
    await review.save();
    console.log("Feedback Submitted:", review);

    res.send(`<script>alert("Form submitted successfully!"); window.location.href='/';</script>`);
}));

// Email Sending Route
app.post("/Loc", wrapAround(async (req, res, next) => {
    const params = req.body;
    if (!params.send) {
        return next(new ExpressError(503, "Can't send"));
    }
    try {
        const templateID = params.key ? process.env.TEMPLATE_ID_BOOK : process.env.TEMPLATE_ID_CONTACT;
        const response = await emailjs.send(process.env.SERVICE_ID, templateID, params, {
            publicKey: process.env.PUBLIC_KEY,
            privateKey: process.env.PRIVATE_KEY
        });
        res.status(200).json({ response });
    } catch (err) {
        next(new ExpressError(500, "Email Sending Failed"));
    }
}));

// Default Route
app.all("*", (req, res) => {
    console.log("Default route hit");
    res.status(400).json({ message: "Backend APIs are under development. Please wait for updates." });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const { status = 503, message = "Something went wrong on the server" } = err;
    console.error("--- ERROR ---", err);
    res.status(status).json({ message });
});

// Start Server
const start = () => {
    const port = app.get("getPort");
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
};

start();
