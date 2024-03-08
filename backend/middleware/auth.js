import { UserModel } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "./catchAsyncError";

export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
  if (!decoded) {
    return next(new ErrorHandler("Access token is not valid", 400));
  }

  req.user = await UserModel.findById(decoded.id);

  next();
});
