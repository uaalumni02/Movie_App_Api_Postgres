const db = require("../database/index");
import * as Response from "../helpers/response/response";

import validator from "../validator/movie";
import Token from "../helpers/jwt/token";

import v from "validator";

class MovieData {
  static async addMovieData(req, res) {
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate(movieData);
      if (error) {
        return Response.responseBadRequest(res);
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
      if (!v.isUUID(id)) {
        return Response.responseValidationError(res);
      }
      const movieById = await db("movie").where({ id }).select();
      if (movieById.length == 0) {
        return Response.responseNotFound(res);
      }
      return Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async deleteMovie(req, res) {
    const { id } = req.params;
    try {
      if (!v.isUUID(id)) {
        return Response.responseValidationError(res);
      }
      const movieToDelete = await db("movie").where({ id }).del();
      if (!movieToDelete) {
        return Response.responseNotFound(res);
      }
      return Response.responseOk(res, movieToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async updateMovie(req, res) {
    const { id } = req.params;
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    const movieData = { ...req.body, userId };
    try {
      const { error } = validator.validate(movieData);
      if (error) {
        return Response.responseBadRequest(res);
      }
      if (!v.isUUID(id)) {
        return Response.responseValidationError(res);
      }
      const movieToUpdate = await db("movie")
        .where({ id })
        .update(movieData)
        .returning("*");
      if (movieToUpdate.length == 0) {
        return Response.responseNotFound(res);
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
        return Response.responseNotFound(res);
      }
      return Response.responseOk(res, movieByUserId);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
