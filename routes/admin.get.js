import { Router } from "express";
// import { authMiddleware } from "../middleware/auth.js";
import Request from "../model/request.model.js";

const router = Router()

// GET /requests - fetch all requests
router.get("/getrequests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    // Convert image buffers to Base64 strings for frontend use
    const formatted = requests.map((r) => ({
      id: r._id,
      title: r.title,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      userImage: r.userImage?.data
        ? `data:${r.userImage.contentType};base64,${r.userImage.data.toString(
            "base64"
          )}`
        : null,
      adminImage: r.adminImage?.data
        ? `data:${r.adminImage.contentType};base64,${r.adminImage.data.toString(
            "base64"
          )}`
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;