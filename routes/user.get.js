import express from "express";
import Request from "../model/request.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all requests of the logged-in user
router.get("/my-reports", authMiddleware("user"), async (req, res) => {
  try {
    const myReports = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(myReports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});


export default router;