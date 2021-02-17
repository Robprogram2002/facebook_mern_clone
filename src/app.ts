import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";

//routes
import authRoutes from "./routes/auth";
import postsRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import profileRoutes from "./routes/profile";
import albumRoutes from "./routes/albums";

const app: Application = express();

app.set("port", process.env.PORT || 8080);

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json({ limit: "100mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// set routes controllers
app.use("/accounts", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentRoutes);
app.use("/profile", profileRoutes);
app.use("/albums", albumRoutes);

//error midlleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json(error);
});

export default app;
