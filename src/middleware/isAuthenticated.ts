import type { NextFunction, Request, Response } from "express";
import { db } from "../db/db.js";
import type { User } from "../types.js";
import { UnauthorizedException } from "../utils/exceptions.js";

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const sessionUser = req.session.user;

  if (!sessionUser || !sessionUser.id) {
    return next(new UnauthorizedException());
  }

  const user = db
    .prepare("SELECT id, email FROM users WHERE id = ?")
    .get(sessionUser.id) as Pick<User, "id" | "email"> | undefined;

  if (!user || !user.id || !user.email) {
    return next(new UnauthorizedException());
  }

  req.user = {
    id: user.id,
    email: user.email,
  };

  return next();
}
