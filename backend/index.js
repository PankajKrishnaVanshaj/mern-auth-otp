import dotenv from "dotenv";
import express from "express";
import { DBConnection } from "./utils/DataBaseConnection.js";
import UserRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error.js";
import cors from "cors";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(ErrorMiddleware);

const allowedOrigins = [process.env.FRONTEND_URL]; // Add more origins as needed
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/v1/auth", UserRouter);

app.get("/api/v1/test", (req, res) => {
  res.send("hello pankri");
});

DBConnection().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server started on http://localhost:${process.env.PORT}`);
  });
});
