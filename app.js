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
    console.log("Incoming request origin:", origin);
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

// CORS debugging middleware
app.use((req, res, next) => {
  console.log("Incoming request:");
  console.log("  Method:", req.method);
  console.log("  URL:", req.url);
  console.log("  Origin:", req.get("Origin"));
  console.log("  Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

// Enable CORS for all routes
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Nice working");
});

// Using Error Middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(
    `Server is working on port:${PORT} in ${process.env.NODE_ENV} Mode`
  );
});
