// routes/bloodRequest.routes.ts
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as bloodRequestController from "../controllers/bloodRequest.controller";

const router = Router();

router.get("/", authMiddleware, bloodRequestController.getAllRequests);
router.post("/create", authMiddleware, bloodRequestController.createRequest);
router.get("/user-request", authMiddleware, bloodRequestController.userRequests);
router.get("/hospital-request", authMiddleware, bloodRequestController.hospitalRequests);
router.post("/create-donor", authMiddleware, bloodRequestController.createDonationRequest);
router.post("/blood-requests/:id/accept", authMiddleware, bloodRequestController.acceptRequest);


export default router;
