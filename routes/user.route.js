import express from "express";
import { forgetPassword, login, profile, profileUpdate, refreshAccessToken, resetPassword, signup } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/refresh-token").get(refreshAccessToken);

//profile Router
router.route("/profile").get(auth, profile);
router.route("/profile-update").post(auth, profileUpdate);


export default router;