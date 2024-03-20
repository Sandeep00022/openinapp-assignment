// external modules
import express from "express";
import cookieParser from "cookie-parser";
//local modules
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import connection from "./config/db.config.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connection
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => console.log(err));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
