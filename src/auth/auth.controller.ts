import type { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service.js";
import { session } from "../utils/index.js";

// REGISTER
async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.register(req.body);

    await session.regenerate(req);

    req.session.user = { id: user.id, email: user.email };

    await session.save(req);

    res.status(201).json({
      payload: { user: { ...user, is_verified: Boolean(user.is_verified) } },
      message: "Register successful",
    });
  } catch (error) {
    next(error);
  }
}

// LOGIN
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.login(req.body);

    await session.regenerate(req);

    req.session.user = { id: user.id, email: user.email };

    await session.save(req);

    res.json({
      payload: {
        user: { ...user, is_verified: Boolean(user.is_verified) },
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

// LOGOUT
async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await session.destroy(req);

    res.json({
      payload: null,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}

// ME
async function me(req: Request, res: Response, next: NextFunction) {
  const { id } = req.user!;

  try {
    const user = await authService.me(id);
    console.log(user);

    res.json({
      payload: user,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  const { id } = req.user!;
  const { password } = req.body;

  try {
    await authService.changePassword(id, password);
    res.json({
      payload: null,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
}

export const authController = {
  register,
  login,
  logout,
  me,
  changePassword,
};
