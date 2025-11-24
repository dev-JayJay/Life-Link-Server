// routes/hospital.routes.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as HospitalController from "../controllers/hospital.controller";

const router = Router();

router.get("/", authMiddleware, HospitalController.getAllHospitals);
router.get("/donations", authMiddleware, HospitalController.getHospitalDonations);

export default router;
