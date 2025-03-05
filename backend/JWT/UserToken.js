const jwt = require("jsonwebtoken");
require("dotenv").config();

function UserToken(req, res, next) {
  
  const secret = req.cookies.id;

  if (!secret) {
    return res.status(500).json({ message: "Authorization token missing" });
  }

  try {
    const decodedToken = jwt.verify(secret, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid token" });
  }
}

module.exports = UserToken;