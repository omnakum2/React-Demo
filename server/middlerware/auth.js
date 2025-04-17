const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token == null)
    return res.status(401).json({ msg: "Not authorized, please log in" });

  jwt.verify(token, "secret", async (err,decode) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });
    req.user = decode;
    next();
  });
};