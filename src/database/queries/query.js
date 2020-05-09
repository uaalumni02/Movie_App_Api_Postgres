import db from "../knex";
import { compare } from "bcrypt";

class Query {
  static async getUsers() {
    try {
      const getAllUsers = await db.select().from("user");
      return getAllUsers;
    } catch (error) {
      throw error;
    }
  }
  static async getMovies() {
    try {
      const getAllMovies = await db.select().from("movie").orderBy("id");
      return getAllMovies;
    } catch (error) {
      throw error;
    }
  }
  static async addMovie(data) {
    try {
      const movieInfo = await db.insert(data).returning("*").into("movie");
      return movieInfo;
    } catch (error) {
      throw error;
    }
  }
  static async movieById(id) {
    try {
      const movieById = await db("movie").where({ id }).select();
      return movieById;
    } catch (error) {
      throw error;
    }
  }
  static async deleteMovie(id) {
    try {
      const movieToDelete = await db("movie").where({ id }).del();
      return movieToDelete;
    } catch (error) {
      throw error;
    }
  }
  static async movieByUserId(userId) {
    try {
      const movieByUserId = await db("movie").where({ userId }).select();
      return movieByUserId;
    } catch (error) {
      throw error;
    }
  }
  static async updateMovie(id, movieData) {
    try {
      const movieToUpdate = await db("movie")
        .where({ id })
        .update(movieData)
        .returning("*");
      return movieToUpdate;
    } catch (error) {
      throw error;
    }
  }
}

export default Query;
