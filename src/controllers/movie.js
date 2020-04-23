const db = require("../database/index");
import * as Response from "../helpers/response/response";



///use character varying for data type
class MovieData {
  static async addMovieData(req, res) {
    const movieData = { ...req.body };
    try {
      const movieInfo = await db
        .insert(movieData)
        .returning("*")
        .into("movies");
      return Response.responseOkCreated(res, movieInfo);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getAllMovies(req, res) {
    try {
      const getAllMoviesByUser = await db.select().from("movies").orderBy("id");
      return Response.responseOk(res, getAllMoviesByUser);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
  static async getMovieById(req, res) {
    const { id } = req.params;
    try {
      const movieById = await db("movies")
        .where({ id: req.params.id })
        .select();
      return Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
  static async deleteMovie(req, res) {
    const { id } = req.params;
    try {
      const movieToDelete = await db("movies")
        .where({ id: req.params.id })
        .del();
      return Response.responseOk(res, movieToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async updateMovie(req, res) {
    const id = req.params.id;
    const movieData = { ...req.body };
    try {
      const movieToUpdate = await db("movies")
        .where({ id })
        .update(movieData)
        .returning("*");
      return Response.responseOk(res, movieToUpdate);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
