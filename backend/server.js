




import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import inquiryRouter from './routes/inquiry.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import contactRouter from './routes/contact.routes.js';
import chatRouter from './routes/chat.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve .env from the backend directory regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// DB
connectDB();

// Middleware
// Normalize origin by stripping trailing slash
const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');

const allowedOrigins = [
    "https://mern-real-estate-system-d82a832ml-group-1-3645.vercel.app",
    "https://mern-real-estate-system-kppsb9ovn-group-1-3645.vercel.app",
    "https://mern-real-estate-system.vercel.app",
    "http://localhost:5000",
    "http://localhost:5173",
    // Allow custom origin from env var (set on Render to your Vercel URL)
    // Normalize to strip any trailing slash
    ...(process.env.CORS_ORIGIN ? [normalizeOrigin(process.env.CORS_ORIGIN)] : []),
].filter(Boolean).map(normalizeOrigin);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) {
            return callback(null, true);
        }
        // Strip trailing slash for consistent comparison
        const normalized = normalizeOrigin(origin);
        // Allow if in the list
        if (allowedOrigins.includes(normalized)) {
            return callback(null, true);
        }
        // Allow any *.vercel.app domain (for dynamic Vercel deployment URLs)
        if (normalized.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        // Allow any *.onrender.com domain
        if (normalized.endsWith('.onrender.com')) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests (belt-and-suspenders)
app.options('*', cors(corsOptions));

app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});

// CORS error handler — return JSON instead of HTML when cors rejects
app.use((err, req, res, next) => {
    if (err.message === "Not allowed by CORS") {
        return res.status(403).json({
            message: "CORS not allowed",
            origin: req.headers.origin || "unknown",
            hint: "Add your Vercel URL as CORS_ORIGIN env var on Render"
        });
    }
    next(err);
});

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const normalized = normalizeOrigin(origin);
            if (allowedOrigins.includes(normalized)) return callback(null, true);
            if (normalized.endsWith('.vercel.app')) return callback(null, true);
            if (normalized.endsWith('.onrender.com')) return callback(null, true);
            callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST"],
        credentials: true
    },
});

io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.chatId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});