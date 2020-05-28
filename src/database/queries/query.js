import db from "../knex";

class Query {
  static async addUser(userdata) {
    try {
      const newUser = await db("user")
        .returning(["id", "username", "password"])
        .insert(userdata);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
  static async getUsers() {
    try {
      const getAllUsers = await db.select().from("user");
      return getAllUsers;
    } catch (error) {
      throw error;
    }
  }
  static async userById(id) {
    try {
      const userById = await db("user").where({ id }).select();
      return userById;
    } catch (error) {
      throw error;
    }
  }
  static async deleteUser(id) {
    try {
      const userToDelete = await db("user").where({ id }).del();
      return userToDelete;
    } catch (error) {
      throw error;
    }
  }
  static async checkUserName(req) {
    try {
      const user = await db("user").where(req);
      return user;
    } catch (error) {
      throw error;
    }
  }
  static async addFbUser(userdata) {
    try {
      const newUser = await db("user")
        .returning(["id", "username", "password"])
        .insert(userdata);
      return newUser;
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
  static async addRating(data) {
    try {
      const ratingInfo = await db.insert(data).returning("*").into("rating");
      return ratingInfo;
    } catch (error) {
      throw error;
    }
  }
  static async getRatings() {
    try {
      const getAllRatings = await db.select().from("rating").orderBy("id");
      return getAllRatings;
    } catch (error) {
      throw error;
    }
  }
  static async ratingById(id) {
    try {
      const ratingById = await db("rating").where({ id }).select();
      return ratingById;
    } catch (error) {
      throw error;
    }
  }
}

export default Query;
