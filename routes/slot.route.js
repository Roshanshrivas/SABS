import express from "express";
import { deleteSlot, slotCreate, slotsAllUpdate, updateSlotById } from "../controllers/timeSlot.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.route("/create").post(auth, isAdmin, slotCreate);
router.route("/update").put(auth, isAdmin, slotsAllUpdate);
router.route("/update/:id").put(auth, isAdmin, updateSlotById);
router.route("/delete/:id").put(auth, isAdmin, deleteSlot);


export default router;