const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    // ✅ Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // ❌ If token missing after split
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ VERIFY using ENV (IMPORTANT FIX)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user
    req.user = decoded;

    next();
  } catch (err) {
    console.log("Auth error:", err.message); // debug
    return res.status(401).json({ message: "Invalid token" });
  }
};