const sendTokenResponse = (
  user,
  statusCode,
  res,
  message = "Success"
) => {
  // Generate JWT Token
  const token = user.generateToken(); // ✅ fixed

  // Cookie expiration (default 7 days)
  const cookieExpire = Number(process.env.JWT_COOKIE_EXPIRE || 7);

  const options = {
    expires: new Date(
      Date.now() + cookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

export default sendTokenResponse;