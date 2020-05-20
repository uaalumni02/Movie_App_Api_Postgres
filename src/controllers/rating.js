import * as Response from "../helpers/response/response";
import Errors from "../helpers/constants/constants";
import validator from "../validator/movie";
import Query from "../database/queries/query";

class RatingData {
  static async addRating(req, res) {
    const rating = { ...req.body };
    try {
      const { error } = validator.validate(rating);
      if (error) {
        return Response.responseBadRequest(res, Errors.VALIDATION);
      }
      const ratingInfo = await Query.addRating(rating);
      return Response.responseOkCreated(res, ratingInfo);
    } catch (err) {
      return Response.responseServerError(res);
    }
  }
  static async getAllRatings(req, res) {
    try {
      const getAllRatings = await Query.getRatings(req);
      return Response.responseOk(res, getAllRatings);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async getRatingById(req, res) {
    const { id } = req.params;
    try {
      const { error } = validator.validate({ id });
      if (error) {
        return Response.responseValidationError(res, Errors.INVALID_ID);
      }
      const ratingById = await Query.ratingById(id);
      return ratingById.length == 0
        ? Response.responseNotFound(res, Errors.INVALID_RATING)
        : Response.responseOk(res, ratingById);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
}

export default RatingData;
