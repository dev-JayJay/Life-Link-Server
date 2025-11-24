// services/bloodRequest.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateBloodRequestInput {
  hospitalId: string;
  bloodType: string;
  units: number;
  urgency?: string;
  notes?: string;
  latitude: number;
  longitude: number;
  userId?: string;
}

export const createBloodRequest = async (data: CreateBloodRequestInput) => {
  const { hospitalId, bloodType, units, urgency = "Normal", notes, latitude, longitude, userId } = data;

  return await prisma.bloodRequest.create({
    data: {
      hospitalId,
      bloodType,
      units,
      urgency,
      notes,
      latitude,
      longitude,
      status: "pending",
      userId
    },
  });
};


export const getAllBloodRequests = async () => {
  return await prisma.bloodRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      hospital: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const getRequestsForHospital = async (hospitalId: string) => {
  return prisma.bloodRequest.findMany({
    where: { hospitalId },
    include: {
      user: {
        select: { id: true, fullName: true, phone: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};


export const getRequestsForUser = async (userId: string) => {
  return prisma.bloodRequest.findMany({
    where: {
      userId: userId,  
    },
    include: {
      hospital: {
        include: {
          user: true,  
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};





interface AcceptRequestParams {
  requestId: string;
  donorId: string;
}

export const acceptRequest = async ({ requestId, donorId }: AcceptRequestParams) => {
  return prisma.bloodRequest.update({
    where: { id: requestId },
    data: { userId: donorId, status: "accepted" },
    include: { user: true, hospital: true },
  });
};

export const rejectRequest = async ({ requestId, donorId }: AcceptRequestParams) => {
  return prisma.bloodRequest.update({
    where: { id: requestId },
    data: { userId: donorId, status: "rejected" },
    include: { user: true, hospital: true },
  });
};


