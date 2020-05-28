import Token from "../helpers/jwt/token";
import bcrypt from "../helpers/bcrypt/bcrypt";
import validator from "../validator/user";
import { checkAuth } from "../middleware/auth/auth";
import Errors from "../helpers/constants/constants";
import * as Response from "../helpers/response/response";
import Query from "../database/queries/query";

class UserData {
  static async addUser(req, res) {
    const { username, password } = req.body;
    try {
      const { error } = validator.validate(req.body);
      if (error) {
        return Response.responseValidationError(res, Errors.VALIDATION);
      }
      const user = await Query.checkUserName({ username: username });
      if (user[0] != null) {
        return Response.responseConflict(res, user);
      } else {
        const hash = await bcrypt.hashPassword(
          password,
          parseInt(process.env.ROUNDS)
        );
        const user = { ...req.body, password: hash };
        const newUser = await Query.addUser(user);
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
      const user = await Query.checkUserName({ username: username });
      if (user.length == 0) {
        return Response.responseBadAuth(res);
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
      return Response.responseBadAuth(res, Errors.INVALID_ID);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const getAllUsers = await Query.getUsers(req);
      return Response.responseOk(res, getAllUsers);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const isAuthorized = checkAuth(req);
      if (isAuthorized) {
        const userToDelete = await Query.deleteUser(id);
        return !userToDelete
          ? Response.responseNotFound(res, Errors.INVALID_USER)
          : Response.responseOk(res, userToDelete);
      }
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
      const userById = await Query.userById(id);
      return userById.length == 0
        ? Response.responseNotFound(res, Errors.INVALID_USER)
        : Response.responseOk(res, userById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async addFbUser(req, res) {
    const { username, password } = req.body;
    
    try {
      // const { error } = validator.validate(req.body);
      // if (error) {
      //   return Response.responseValidationError(res, Errors.VALIDATION);
      // }
      // const user = await Query.checkUserName({ username: username });
      // if (user[0] != null) {
      //   return Response.responseConflict(res, user);
      // } else {
        // const hash = await bcrypt.hashPassword(
        //   password,
        //   parseInt(process.env.ROUNDS)
        // );
        const user = { ...req.body, password: null };
        // check if the username, exists ?
          //Yes - 
            // get the user data
            // sign token and send back response
          //No - 
            // Create an account 
            // Sign token and send back response
        const newUser = await Query.addFbUser(user);
        if (newUser.length > 0) {
          const { id, username } = newUser[0];
          const token = Token.sign({ username, userId: id });
          const userData = { username, token, id };
          return Response.responseOkUserCreated(res, userData);
        // }
      }
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default UserData;
