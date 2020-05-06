import db from "../database/knex";
import * as Response from "../helpers/response/response";
import Errors from "../helpers/constants/constants";
import validator from "../validator/movie";
import Token from "../helpers/jwt/token";

class MovieData {
  static async addMovieData(req, res) {
   // put authorization stuff in helper; gettign auth from req header...need to send it to the function
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate(movieData);
      if (error) {
        return Response.responseBadRequest(res, Errors.VALIDATION);
      }
      const movieInfo = await db.insert(movieData).returning("*").into("movie");
      return Response.responseOkCreated(res, movieInfo);
    } catch (err) {
      return Response.responseServerError(res);
    }
  }
  static async getAllMovies(req, res) {
    try {
      const getAllMoviesByUser = await db.select().from("movie").orderBy("id");
      return Response.responseOk(res, getAllMoviesByUser);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getMovieById(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const movieById = await db("movie").where({ id }).select();
      if (movieById.length == 0) {
        return Response.responseNotFound(res, Errors.INVALID_MOVIE);
      }
      return Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  //check for authorization before deleting and updating can use a middlware to check if logged in
  static async deleteMovie(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const movieToDelete = await db("movie").where({ id }).del();
      if (!movieToDelete) {
        return Response.responseNotFound(res, Errors.INVALID_MOVIE);
      }
      return Response.responseOk(res, movieToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async updateMovie(req, res) {
    const { id } = req.params;
    // put authorization stuff in helper; gettign auth from req header...need to send it to the function
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate(movieData);
      if (error) {
        return Response.responseBadRequest(res, Errors.VALIDATION);
      }
      const { err } = validator.validate({ id });
      if (err) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const movieToUpdate = await db("movie")
        .where({ id })
        .update(movieData)
        .returning("*");
      if (movieToUpdate.length == 0) {
        return Response.responseNotFound(res, Errors.INVALID_MOVIE);
      }
      return Response.responseOk(res, movieToUpdate);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getMovieByUser(req, res) {
    const { userId } = req.params;
    try {
      const movieByUserId = await db("movie").where({ userId }).select();
      if (movieByUserId.length == 0) {
        return Response.responseNotFound(res, Errors.INVALID_MOVIE);
      }
      return Response.responseOk(res, movieByUserId);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
