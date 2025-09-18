import { Router } from "express";
import multer from "multer";
import Request from "../model/request.model.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Configure Multer to store files in memory (buffer only, no temp folder)
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload (User submits a new request)
router.post(
  "/upload",
  authMiddleware("user"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Send form-data with key 'image'." });
      }

      const newRequest = new Request({
        title: req.body.title,
        description: req.body.description,
        userImage: {
          data: req.file.buffer,          // direct buffer, no fs
          contentType: req.file.mimetype,
        },
        location: {
          type: "Point",
          coordinates: [
            parseFloat(req.body.longitude),
            parseFloat(req.body.latitude),
          ],
        },
        status: "pending",
      });

      await newRequest.save();

      res.json({
        message: "Request submitted successfully",
        id: newRequest._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /update/:id (Admin updates request)
router.post(
  "/update/:id",
  authMiddleware("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      if (req.body.status) {
        request.status = req.body.status;
      }

      if (req.file) {
        request.adminImage = {
          data: req.file.buffer,          // direct buffer
          contentType: req.file.mimetype,
        };
      }

      await request.save();

      res.json({
        message: "Request updated successfully",
        id: request._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
