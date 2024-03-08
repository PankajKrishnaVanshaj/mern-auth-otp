// token options
const accessTokenOptions = {
  expires: new Date(Date.now() + process.env.ACCESS_TOKEN * 60 * 60 * 1000),
  httpOnly: true,
  sameSite: "lax",
  secure: true,
};

const refreshTokenOptions = {
  expires: new Date(
    Date.now() + process.env.REFRESH_TOKEN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  sameSite: "lax",
  secure: true,
};

export const authToken = (user, statusCode, res) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  res.cookie("accessToken", accessToken, accessTokenOptions);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    message: "user login",
    user,
    accessToken,
  });
};
