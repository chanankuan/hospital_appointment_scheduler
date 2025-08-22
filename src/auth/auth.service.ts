import { db } from "../db/db.js";
import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import type { PublicUser, User } from "../types.js";
import { ConflictException, UnauthorizedException } from "../utils/index.js";

async function register(registerDto: RegisterInput) {
  const { first_name, last_name, email, phone_number, password } = registerDto;

  // Check for existing user
  const existingUser = db
    .prepare(
      `
      SELECT
        email,
        phone_number
      FROM users
      WHERE email = ? OR phone_number = ?
    `
    )
    .get(email, phone_number) as Partial<User> | undefined;

  // Ensure email and phone_number do not exist
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ConflictException("Email already in use");
    }
    if (existingUser.phone_number === phone_number) {
      throw new ConflictException("Phone number already in use");
    }
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user data
  const stmt = db.prepare(`
    INSERT INTO users (first_name, last_name, email, phone_number, password, is_verified)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(first_name, last_name, email, phone_number, hashedPassword, 1);

  // Query new user
  const newUser = db
    .prepare(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone_number,
        CASE WHEN is_verified = 1 THEN TRUE ELSE FALSE END AS is_verified
      FROM users WHERE email = ?
    `
    )
    .get(email) as PublicUser;

  // Transform is_verified
  newUser.is_verified = Boolean(newUser.is_verified);

  return newUser;
}

async function login(loginDto: LoginInput) {
  const { email, password } = loginDto;

  const dbUser = db
    .prepare(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        CASE WHEN is_verified = 1 THEN TRUE ELSE FALSE END AS is_verified
      FROM users WHERE email = ?
    `
    )
    .get(email) as PublicUser & Pick<User, "password">;

  if (!dbUser) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, dbUser.password);

  if (!isValidPassword) {
    throw new UnauthorizedException("Invalid credentials");
  }

  const { password: hashPassword, ...user } = dbUser;

  // Transform is_verified
  user.is_verified = Boolean(user.is_verified);

  return user as PublicUser;
}

async function me(id: number) {
  const dbUser = db
    .prepare(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        phone_number,
        CASE WHEN is_verified = 1 THEN TRUE ELSE FALSE END AS is_verified
      FROM users WHERE id = ?
    `
    )
    .get(id) as PublicUser;

  // Transform is_verified
  dbUser.is_verified = Boolean(dbUser.is_verified);

  return dbUser;
}

async function changePassword(id: number, newPassword: string) {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const stmt = db.prepare(`
    UPDATE users
       SET password = ?
     WHERE id = ?
  `);

  stmt.run(hashedPassword, id);
}

export const authService = {
  register,
  login,
  me,
  changePassword,
};
