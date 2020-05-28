import express from "express";
import userController from "../controllers/user";

const router = express.Router();

router.route("/").post(userController.addFbUser);

export default router;
