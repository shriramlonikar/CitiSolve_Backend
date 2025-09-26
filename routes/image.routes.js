import { Router } from "express";
import multer from "multer";
import Request from "../model/request.model.js";
import { authMiddleware } from "../middleware/auth.js";
import User from "../model/user.model.js";

const router = Router();

// Configure Multer to store files in memory (buffer only, no temp folder)
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload (User submits a new request)
router.post(
  "/upload",
  authMiddleware("user"),
  upload.single("image"), // expects FormData with key "image"
  async (req, res) => {
    try {
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      if (!req.file) {
        return res
          .status(400)
          .json({ error: "No file uploaded. Send form-data with key 'image'." });
      }

      const newRequest = new Request({
        title: req.body.title,
        description: req.body.description,
        userImage: {
          data: req.file.buffer, // ✅ buffer directly from memory
          contentType: req.file.mimetype,
        },
        status: "pending",
        userId: req.user._id,
      });

      await newRequest.save();

      res.json({
        message: "Request submitted successfully",
        id: newRequest._id,
      });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);


// multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// router.post(
//   "/upload",
//   authMiddleware("user"),
//   upload.single("image"), // must match FormData field name
//   (req, res) => {
//     console.log("req.body:", req.body);
//     console.log("req.file:", req.file);

//     if (!req.file) {
//       return res.status(400).json({ message: "File not uploaded" });
//     }

//     res.json({
//       message: "Report uploaded successfully!",
//       file: req.file,
//       body: req.body,
//     });
//   }
// );

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
