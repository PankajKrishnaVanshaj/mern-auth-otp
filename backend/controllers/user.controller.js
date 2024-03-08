import { CatchAsyncError } from "../middleware/catchAsyncError.js";
import { UserModel } from "../models/user.model.js";
import { VerificationModel } from "../models/verificationModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { authToken } from "../utils/authToken.js";
import mailSender from "../utils/mailSender.js";

// generate otp for varification
export const generateOtp = CatchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email === "") {
      return next(new ErrorHandler("Email is required", 400));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const mailOptions = {
      email: email,
      subject: "otp test",
      OTP: otp,
    };

    await mailSender(mailOptions);

    await VerificationModel.deleteMany({ email: email });
    const newVerification = await VerificationModel.create({
      email: email,
      otp: otp,
    });

    res.status(200).json({
      success: true,
      message: "OTP generate successfully ",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// register user
export const registerUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    if (password.length < 6) {
      return next(
        new ErrorHandler("Password should be atleast 6 characters long", 400)
      );
    }

    const existingUser = await UserModel.findOne({ email: email });
    const existingOtp = await VerificationModel.findOne({ email: email });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }
    if (!existingOtp) {
      return next(new ErrorHandler("Please send otp first", 400));
    }

    const isOTPMached = await existingOtp.compareOtp(otp);
    if (!isOTPMached) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const newUser = new UserModel({
      name: name,
      email: email,
      password: password,
    });

    await newUser.save();
    await VerificationModel.deleteOne({ email: email });

    return next(new ErrorHandler("registered successfully", 400));
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// login user
export const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    const existUser = await UserModel.findOne({ email: email });

    if (!existUser) {
      return next(new ErrorHandler("Register before login", 400));
    }

    const passwordMatch = existUser.comparePassword(password);
    if (!passwordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    authToken(existUser, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// logout user
export const logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    res.cookie("accessToken", "", { maxAge: 1 });
    res.cookie("refreshToken", "", { maxAge: 1 });

    res.status(200).json({
      success: true,
      massage: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// forgot user password
export const forgotPassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !password || !otp) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return next(new ErrorHandler("User doesn't  exist", 400));
    }

    const existingOtp = await VerificationModel.findOne({ email: email });
    if (!existingOtp) {
      return next(new ErrorHandler("Please send otp first", 400));
    }

    const isOTPMached = await existingOtp.compareOtp(otp);
    if (!isOTPMached) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    existingUser.password = password;
    await existingUser.save();
    await VerificationModel.deleteOne({ email: email });
    return next(new ErrorHandler("Password changed successfully", 200));
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
