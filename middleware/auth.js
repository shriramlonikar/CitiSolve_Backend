import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Admin from "../model/admin.model.js";

export const authMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "No token provided" });

      // Verify token
      const decoded = jwt.verify(token, "nnanna");

      let account;
      if (role == "user") {
        account = await User.findById(decoded.id);
      } else if (role == "admin") {
        account = await Admin.findById(decoded.id);
      }

      if (!account) {
        return res.status(403).json({ message: "Unauthorized" });
      }

    //   req.user = account; // attach to request
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token error in middleware" });
      console.log(err);
    }
};
};