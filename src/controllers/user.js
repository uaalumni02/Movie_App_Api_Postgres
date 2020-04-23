const db = require("../database/index");
import Token from "../helpers/jwt/token";
import bcrypt from "../helpers/bcrypt/bcrypt";
import validator from "../validator/user";
import * as Response from "../helpers/response/response";

class UserData {
  static async addUser(req, res) {
    const { password } = req.body;
    try {
      const result = await validator.validateAsync(req.body);
      if (!result.error) {
        const hash = await bcrypt.hashPassword(password, 10);
        const user = { ...req.body, password: hash };
        const newUser = await db("user")
          .returning(["id", "username", "password"])
          .insert(user);
        if (newUser.length > 0) {
          const { id, username } = newUser[0];
          const token = Token.sign({ username, userId: id });
          const userData = { username, token };
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
      const result = await validator.validateAsync(req.body);
      if (!result.error) {
        const user = await db("user").where({ username: username });
        if (user == null) {
          return Response.responseBadAuth(res, user);
        }
        const isSamePassword = await bcrypt.comparePassword(
          password,
          user[0].password
        );
        if (isSamePassword) {
          const token = Token.sign({
            username: user.username,
            userId: user._id,
          });
          const userData = { user, token };
          return Response.responseOk(res, userData);
        }
        return Response.responseBadAuth(res);
      } else {
        return Response.responseValidationError(res);
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getAllUsers(req, res) {
    try {
      const getAllUsers = await db.select().from("user");
      return Response.responseOk(res, getAllUsers);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const userToDelete = await db("user").where({ id: req.params.id }).del();
      return Response.responseOk(res, userToDelete);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getUserById(req, res) {
    const { id } = req.params;
    try {
      const userById = await db("user").where({ id: req.params.id }).select();
      return Response.responseOk(res, userById);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
}

export default UserData;
