import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const fetchHospitalDonations = (hospitalId: string) => {
  return prisma.donation.findMany({
    where: { hospitalId },
    include: { donor: true },
    orderBy: { date: "desc" }
  });
};
