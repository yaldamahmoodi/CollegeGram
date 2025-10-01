import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserModel } from "../db/models/user.model.ts";

interface CustomJwtPayload extends JwtPayload {
  _id: string;         // keep consistent with what you sign
  username?: string;
}

export async function verifyAndLoadUser(token?: string) {
  if (!token) throw new Error("TOKEN_NOT_PROVIDED");

  const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
  const payload = jwt.verify(token, jwtSecret) as CustomJwtPayload;

  if (!payload._id) throw new Error("INVALID_TOKEN");

  const user = await UserModel.findById(payload._id);
  if (!user) throw new Error("USER_NOT_FOUND");

  return { id: payload._id, username: payload.username };
}
