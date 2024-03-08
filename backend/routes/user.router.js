import express from "express";
import {
  forgotPassword,
  generateOtp,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { uploadFileMulter } from "../utils/multer.js";
const UserRouter = express.Router();

UserRouter.route("/generateotp").post(generateOtp);
UserRouter.route("/register").post(registerUser);
// UserRouter.post("/register", uploadFileMulter.single("file"), registerUser);
UserRouter.route("/login").post(loginUser);
UserRouter.route("/logout").post(logoutUser);
UserRouter.route("/forgotpassword").post(forgotPassword);

export default UserRouter;
