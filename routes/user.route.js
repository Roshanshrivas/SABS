import express from "express";
import { login, signup } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
// router.route("/reset-password").post();
// router.route("/refresh-token").get();


export default router;