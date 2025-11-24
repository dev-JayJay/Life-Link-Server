// controllers/bloodRequest.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bloodRequestService from "../services/bloodRequest.service";

const prisma = new PrismaClient();

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { hospitalId, bloodType, units, urgency, notes, latitude, longitude } = req.body;

    if (!hospitalId || !bloodType || !units || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await bloodRequestService.createBloodRequest({
      hospitalId,
      bloodType,
      units: Number(units),
      urgency,
      notes,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    res.status(201).json(request);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createDonationRequest = async (req: Request, res: Response) => {
  try {
    const { hospitalId, bloodType, notes, latitude, longitude } = req.body;

    if (!hospitalId || !bloodType || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await bloodRequestService.createBloodRequest({
      hospitalId,
      bloodType,
      notes,
      latitude: Number(latitude),
      longitude: Number(longitude),
      units: 1,
      urgency: "Normal",
      userId: req.user!.id,
    });

    res.status(201).json(request);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const hospitalRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const hospital = await prisma.hospital.findUnique({
      where: { userId },
    });

    if (!hospital) {
      return res.status(404).json({ status: 404, error: "Hospital not found" });
    }

    console.log("Hospital ID resolved:", hospital.id);

    const requests = await bloodRequestService.getRequestsForHospital(hospital.id);

    console.log("Hospital requests:", requests);

    return res.json({ status: 200, data: requests });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: 500, error: error.message });
  }
};


export const userRequests = async (req: Request, res: Response) => {
  try {
    const donorId = req.user!.id;

    const requests = await bloodRequestService.getRequestsForUser(donorId);

    return res.json({ status: 200, data: requests });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ status: 500, error: error.message });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await bloodRequestService.getAllBloodRequests();
    res.status(200).json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const acceptRequest = async (req: Request, res: Response) => {
  try {

    const accepted = await bloodRequestService.acceptRequest({
      requestId: req.params.id,
      donorId: req.user!.id,
    });

    res.status(200).json(accepted);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {

    const accepted = await bloodRequestService.rejectRequest({
      requestId: req.params.id,
      donorId: req.user!.id,
    });

    res.status(200).json(accepted);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
