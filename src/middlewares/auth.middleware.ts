import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing token" });
    const token = auth.split(" ")[1];
    const payload: any = jwt.verify(token, JWT_SECRET);
    // payload: { id, role }
    // attach user/hospital info
    if (payload.role === "HOSPITAL") {
      const hospital = await prisma.user.findUnique({ where: { id: payload.id }});
      (req as any).user = { id: hospital!.id, role: "HOSPITAL" };
    } else {
      const user = await prisma.user.findUnique({ where: { id: payload.id }});
      (req as any).user = { id: user!.id, role: "USER" };
    }
    next();
  } catch (err: any) {
    console.error(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
