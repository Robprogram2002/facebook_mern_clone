import app from "./app";
import mongoose from "mongoose";
import socket from "socket.io";
import * as dotenv from "dotenv";

dotenv.config();

const uriDB = process.env.MONGO_URI!;

const main = async () => {
  try {
    await mongoose.connect(uriDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    const server = app.listen(app.get("port"));
    console.log("Server on port", app.get("port"));
    const io = socket(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  } catch (error) {
    console.log(error);
  }
};

main();
