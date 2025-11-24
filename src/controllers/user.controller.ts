import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { userId, latitude, longitude } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { latitude, longitude },
    });

    res.json({ user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
