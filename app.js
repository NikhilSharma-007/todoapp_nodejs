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
  origin: "https://todoapp-react-psi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
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
