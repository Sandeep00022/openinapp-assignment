import express from "express";
import userRouter from "./routes/user.routes.js"

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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
