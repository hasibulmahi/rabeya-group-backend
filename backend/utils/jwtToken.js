var jwt = require("jsonwebtoken");
//Create token and saving in cookie
const sendToken = (user, role, statusCode, res) => {
  try {
    const newToken = jwt.sign(
      {
        data: {
          id: user._id,
          role: user.role,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    //console.log("newToken", newToken);

    const token = user.getJWTToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    const value = token + "," + role;
    res.status(statusCode).cookie("token", value, options).json({
      success: true,
      user,
      authToken: newToken,
    });
    // console.log(token);
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendToken;
