import express from "express";
import checkAuth from "../middleware/check-auth";
import userController from "../controllers/user";

const router = express.Router();

router
  .route("/")
  .post(userController.addUser)
  .get(checkAuth, userController.getAllUsers);

router.post("/login", userController.userLogin);

router
  .route("/:id")
  .delete(checkAuth, userController.deleteUser)
  .get(checkAuth, userController.getUserById);

export default router;
