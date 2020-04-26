const db = require("../database/index");
import * as Response from "../helpers/response/response";

import validator from "../validator/movie";
import Token from "../helpers/jwt/token";

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
  //all catch blocks should have the server error
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
      const movieById = await db("movie").where({ id }).select();
      return Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async deleteMovie(req, res) {
    const { id } = req.params;
    try {
      const movieToDelete = await db("movie").where({ id }).del();
      return Response.responseOk(res, movieToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async updateMovie(req, res) {
    const id = req.params.id;
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = Token.decode(jwtToken).userId;
    const movieData = { ...req.body, userId };
    try {
      const result = await validator.validateAsync(movieData);
      if (!result.error) {
        const movieToUpdate = await db("movie")
          .where({ id })
          .update(movieData)
          .returning("*");
        //what happens if ID does not exist; also follow same coding patter as add movie regading validation above
        return Response.responseOk(res, movieToUpdate);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
