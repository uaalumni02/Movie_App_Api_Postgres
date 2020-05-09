import * as Response from "../helpers/response/response";
import Errors from "../helpers/constants/constants";
import validator from "../validator/movie";
import getToken from "../helpers/auth/auth";
import Query from "../database/queries/query";

class MovieData {
  static async addMovieData(req, res) {
    const userId = getToken(req);
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate(movieData);
      if (error) {
        return Response.responseBadRequest(res, Errors.VALIDATION);
      }
      const movieInfo = await Query.addMovie(movieData);
      return Response.responseOkCreated(res, movieInfo);
    } catch (err) {
      return Response.responseServerError(res);
    }
  }
  static async getAllMovies(req, res) {
    try {
      const getAllMovies = await Query.getMovies(req);
      return Response.responseOk(res, getAllMovies);
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
      const movieById = await Query.movieById(id);
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
      const movieToDelete = await Query.deleteMovie(id);
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
    const userId = getToken(req);
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
      const movieToUpdate = await Query.updateMovie(id, movieData);
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
      const movieByUserId = await Query.movieByUserId(userId);
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
