import mongoose from "mongoose";
import ErrorResponse from "../utils/errorResponse.js";

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return next(
        new ErrorResponse(`${paramName} is required`, 400)
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(
        new ErrorResponse(`Invalid ${paramName}`, 400)
      );
    }

    next();
  };
};

export default validateObjectId;