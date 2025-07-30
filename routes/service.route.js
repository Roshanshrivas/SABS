import express from "express";
import { getAllservice, serviceCreate, serviceDelete, serviceUpdate } from "../controllers/services.js";
import { auth, isAdmin, isUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

//Services Routes Access Only Admin
router.route("/appointment-create").post(auth, isAdmin, serviceCreate);
router.route("/appointment-update/:serviceId").put(auth, isAdmin, serviceUpdate);
router.route("/appointment-delete/:serviceId").delete(auth, isAdmin, serviceDelete);

//GetAllServices Route Access Only user
router.route("/getallservices").get(auth, isUser, getAllservice);


export default router;