const db = require("../database/index");
import * as Response from "../helpers/response/response";

import validator from "../validator/movie";
import jwt from "jsonwebtoken";
const { JWT_KEY } = process.env;

class MovieData {
  static async addMovieData(req, res) {
    //if you try to add movie wihtout everything it will return a server error; however, should have a bad request error, in other controllers also
    const accessToken = req.get("Authorization");
    const jwtToken = accessToken.split(" ")[1];
    const userId = jwt.verify(jwtToken, JWT_KEY).userId;
    const movieData = { ...req.body, userId };
    try {
      const result = await validator.validateAsync(movieData);
      if (!result.error) {
        const movieInfo = await db
          .insert(movieData)
          .returning("*")
          .into("movie");
        //use else statement here for error handling
        return Response.responseOkCreated(res, movieInfo);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getAllMovies(req, res) {
    try {
      const getAllMoviesByUser = await db.select().from("movie").orderBy("id");
      return Response.responseOk(res, getAllMoviesByUser);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }

  static async getMovieById(req, res) {
    const { id } = req.params;
    try {
      const movieById = await db("movie").where({ id }).select();
      return Response.responseOk(res, movieById);
    } catch (error) {
      return Response.responseNotFound(res);
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
    const userId = jwt.verify(jwtToken, JWT_KEY).userId;
    const movieData = { ...req.body, userId };
    try {
      const result = await validator.validateAsync(movieData);
      if (!result.error) {
        const movieToUpdate = await db("movie")
          .where({ id })
          .update(movieData)
          .returning("*");
        return Response.responseOk(res, movieToUpdate);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default MovieData;
