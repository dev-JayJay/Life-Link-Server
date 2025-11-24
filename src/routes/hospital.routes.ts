// routes/hospital.routes.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { getAllHospitals } from "../controllers/hospital.controller";

const router = Router();

router.get("/", authMiddleware, getAllHospitals);

export default router;
