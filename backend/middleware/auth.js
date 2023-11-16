const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Admin = require("../models/User/adminModel");
const SubAdmin = require("../models/User/subAdminModel");
const Manager = require("../models/User/managerModel");
const Client = require("../models/User/clientModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const reqHeader = req.headers.authorization;

  const newtokenData = reqHeader?.split(" ");

  const token = newtokenData[1];
  if (!token) {
    next(new ErrorHandler("Please Login to access this resource", 401));
  } else {
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodeData", decodeData);
    if (decodeData.data.role === "Admin") {
      req.user = await Admin.findById(decodeData.data.id);
    }
    if (decodeData.data.role === "Hr") {
      req.user = await SubAdmin.findById(decodeData.data.id);
    }
    if (decodeData.data.role === "Manager") {
      req.user = await Manager.findById(decodeData.data.id);
    }
    if (decodeData.data.role === "Client") {
      req.user = await Client.findById(decodeData.data.id);
    }
    // console.log(typeof token);
    next();
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
