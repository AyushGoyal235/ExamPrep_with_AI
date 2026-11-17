const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      if (req.originalUrl.startsWith("/api/")) {
        return res.status(401).json({
          success: false,
          message: "Please login to continue."
        });
      }
      return res.redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("_id name email");

    if (!user) {
      res.clearCookie("token", cookieOptions());
      if (req.originalUrl.startsWith("/api/")) {
        return res.status(401).json({
          success: false,
          message: "User account no longer exists. Please login again."
        });
      }
      return res.redirect("/");
    }

    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token", cookieOptions());
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again."
      });
    }
    return res.redirect("/");
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  };
}

module.exports = { protect, cookieOptions };
