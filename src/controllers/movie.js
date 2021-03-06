import * as Response from "../helpers/response/response";
import Errors from "../helpers/constants/constants";
import validator from "../validator/movie";
import { getToken, checkAuth } from "../middleware/auth/auth";
import Query from "../database/queries/query";

class MovieData {
  static async addMovieData(req, res) {
    const movieData = { ...req.body };
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
      return movieById.length == 0
        ? Response.responseNotFound(res, Errors.INVALID_MOVIE)
        : Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async deleteMovie(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const isAuthorized = checkAuth(req);
      if (isAuthorized) {
        const movieToDelete = await Query.deleteMovie(id);
        return !movieToDelete
          ? Response.responseNotFound(res, Errors.INVALID_MOVIE)
          : Response.responseOk(res, movieToDelete);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async updateMovie(req, res) {
    const { id } = req.params;
    const userId = getToken(req);
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const isAuthorized = checkAuth(req);
      if (isAuthorized) {
        const { error } = validator.validate(movieData);
        if (error) {
          return Response.responseBadRequest(res, Errors.VALIDATION);
        }
        const movieToUpdate = await Query.updateMovie(id, movieData);
        return movieToUpdate.length == 0
          ? Response.responseNotFound(res, Errors.INVALID_MOVIE)
          : Response.responseOk(res, movieToUpdate);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async getMovieByUser(req, res) {
    const { userId } = req.params;
    try {
      const { error } = validator.validate({ userId });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_USER_ID);
      }
      const movieByUserId = await Query.movieByUserId(userId);
      return movieByUserId.length == 0
        ? Response.responseNotFound(res, Errors.INVALID_MOVIE)
        : Response.responseOk(res, movieByUserId);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
