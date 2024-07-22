import express from "express";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config({
  path: "./data/config.env",
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://todoapp-react-psi.vercel.app",
      "http://localhost:3000",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

// Using Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log("Origin:", req.get("Origin"));
  console.log("Headers:", req.headers);
  next();
});

// Using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Nice working");
});

// Using Error Middleware
app.use(errorMiddleware);
