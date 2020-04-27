import express from "express";
import checkAuth from "../middleware/check-auth";
import movieController from "../controllers/movie";

const router = express.Router();


router.route("/:userId").get(checkAuth, movieController.getMovieByUser);


export default router;