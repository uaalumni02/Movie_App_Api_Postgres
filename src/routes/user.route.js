import express from "express";

import userController from "../controllers/user";

const router = express.Router();

router.route("/").post(userController.addUser).get(userController.getAllUsers);

router.post("/login", userController.userLogin);

router
  .route("/:id")
  .delete(userController.getUserById)
  .get(userController.getUserById);

export default router;
