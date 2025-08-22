import express from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../middleware/validate.js";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "./auth.schema.js";
import { isAuthenticated } from "../middleware/index.js";

export const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.get("/logout", isAuthenticated, authController.logout);
authRouter.get("/me", isAuthenticated, authController.me);
authRouter.get(
  "/change-password",
  isAuthenticated,
  validate(changePasswordSchema),
  authController.changePassword
);
