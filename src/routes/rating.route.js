import express from "express";
import checkAuth from "../middleware/check-auth";
import ratingController from "../controllers/rating";

const router = express.Router();

router
  .route("/")
  .post(checkAuth, ratingController.addRating)
  .get(checkAuth, ratingController.getAllRatings);

router.route("/:id").get(checkAuth, ratingController.getRatingById);

export default router;
