// controllers/hospital.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as donationServices from "../services/donation.service";

const prisma = new PrismaClient();

export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json(hospitals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalDonations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({ status: 404, error: "Hospital not found" });
    }

    const donations = await donationServices.fetchHospitalDonations(userId);
    console.log("this is the users that mad donation to this hospital", donations);
    res.json({ success: true, data: donations });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

