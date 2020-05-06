import db from "../database/knex";
import Token from "../helpers/jwt/token";
import bcrypt from "../helpers/bcrypt/bcrypt";
import validator from "../validator/user";
import Errors from "../helpers/constants/constants";
import * as Response from "../helpers/response/response";


//remove db operations and put in helper

class UserData {
  static async addUser(req, res) {
    const { username, password } = req.body;
    try {
      const { error } = validator.validate(req.body);
      if (error) {
        return Response.responseValidationError(res, Errors.VALIDATION);
      }
      const user = await db("user").where({ username: username });
      if (user[0] != null) {
        return Response.responseConflict(res, user);
      } else {
        //can use helper function to hash pswd
        const hash = await bcrypt.hashPassword(password, 10);
        const user = { ...req.body, password: hash };
        const newUser = await db("user")
          .returning(["id", "username", "password"])
          .insert(user);
        if (newUser.length > 0) {
          const { id, username } = newUser[0];
          const token = Token.sign({ username, userId: id });
          const userData = { username, token, id };
          return Response.responseOkUserCreated(res, userData);
        }
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async userLogin(req, res) {
    const { username, password } = req.body;
    try {
      const { error } = validator.validate(req.body);
      if (error) {
        return Response.responseValidationError(res, Errors.VALIDATION);
      }
      const user = await db("user").where({ username: username });
      if (user.length == 0) {
        return Response.responseBadAuth(res);
      }
      const isSamePassword = await bcrypt.comparePassword(
        password,
        user[0].password
      );
      if (isSamePassword) {
        //sign can be in helper 
        const token = Token.sign({
          username: user.username,
          userId: user._id,
        });
        const userData = { user, token };
        return Response.responseOk(res, userData);
      }
      return Response.responseBadAuth(res, Errors.INVALID_ID);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getAllUsers(req, res) {
    try {
      const getAllUsers = await db.select().from("user");
      return Response.responseOk(res, getAllUsers);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async deleteUser(req, res) {
    //research how to make it where need authoriztion before deleting ie middleware 
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const userToDelete = await db("user").where({ id }).del();
      if (!userToDelete) {
        return Response.responseNotFound(res, Errors.INVALID_USER);
      }
      return Response.responseOk(res, userToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const userById = await db("user").where({ id }).select();
      //can use ternary for lines 103 - 106 and similiar places in other functions 
      if (userById.length == 0) {
        return Response.responseNotFound(res, Errors.INVALID_USER);
      }
      return Response.responseOk(res, userById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default UserData;
