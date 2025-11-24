import { Router } from "express";
import authRoutes from "./auth.routes";
import bloodRequestRoutes from "./bloodRequest.routes";
import hospitalRoutes from "./hospital.routes";
// import userRoutes from "./user.routes";

const router = Router();


router.use("/auth", authRoutes);
router.use("/blood-requests", bloodRequestRoutes);
router.use("/hospitals", hospitalRoutes);
// router.use("/users", userRoutes);

export default router;
