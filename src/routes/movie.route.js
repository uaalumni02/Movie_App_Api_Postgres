import express from "express";

import movieController from "../controllers/movie";

const router = express.Router();

router
  .route("/:id")
  .delete(movieController.deleteMovie)
  .patch(movieController.updateMovie)
  .get(movieController.getMovieById);

router.route("/").get(movieController.getAllMovies);

router.route("/").post(movieController.addMovieData);

export default router;
