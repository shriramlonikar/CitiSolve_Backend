import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Admin from "../model/admin.model.js";

export const authMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      console.log("Auth header:", authHeader);
      console.log("Token being verified:", token);

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // verify with your secret
      const decoded = jwt.verify(token, "nnanna");

      let account;
      if (role === "user") {
        account = await User.findById(decoded.id);
      } else if (role === "admin") {
        account = await Admin.findById(decoded.id);
      }

      if (!account) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      req.user = account; // attach user/admin if needed
      next();
    } catch (err) {
      console.log("Auth error:", err.message);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};