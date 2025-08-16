import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "./config/index.js";
import { type HttpException } from "./types.js";

export const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Object && "status" in error && "message" in error) {
    const { status = 500, message = "Server error" } = error as HttpException;
    res.status(status).json({ message });
  } else {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
