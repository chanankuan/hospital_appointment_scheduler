import fs from "node:fs";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { v4 as uuidv4 } from "uuid";
import morgan from "morgan";
import cors from "cors";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/index.js";
import { authRouter } from "./auth/index.js";
import { type HttpException } from "./types.js";
import { Exception, NotFoundException } from "./utils/exceptions.js";

export const app = express();

// LOGS (ONLY DEV ENV)
if (config.nodeEnv === "development") {
  app.use(
    morgan("dev", {
      skip: req => req.url.includes(".well-known"),
    })
  );
}

// TODO: ADD WHITELIST
app.use(cors());
app.use(express.json());

// CREATE REDIS CLIENT
const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.connect().catch(console.error); // Connect to Redis

// CREATE REDIS STORE
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.use(
  session({
    store: redisStore,
    name: "sid", // cookie name
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: config.sessionSecret,
    cookie: {
      httpOnly: true,
      secure: config.nodeEnv === "production", // only HTTPS in prod
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    genid: function (req) {
      return uuidv4(); // use UUIDs for session IDs
    },
  })
);

// SWAGGER SETUP
const swaggerFile = fs.readFileSync("./src/swagger/swagger.yaml", "utf8");
const swaggerDocument = yaml.load(swaggerFile) as swaggerUi.JsonObject;

// REFRESH THE SESSION WHILE THE USER IS ACTIVE
app.use((req, _, next) => {
  if (req.session) {
    req.session.touch(); // refresh expiration
  }
  next();
});

// AUTH ROUTE
app.use("/api/auth", authRouter);

// SWAGGER UI ROUTE
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// NOT FOUND ROUTE
app.use((_, res, next) => {
  // res.status(404).json({ message: "Route not found" });
  next(new NotFoundException("Route not found"));
});

// HANDLE ERRORS
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Exception) {
    const { statusCode, error, message } = err;

    return res.status(statusCode).json({
      statusCode: statusCode,
      error: error,
      message: message,
    });
  }

  res.status(500).json({
    statusCode: 500,
    error: "InternalServerError",
    message: "Server error",
  });
});

// LISTEN THE APP
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
