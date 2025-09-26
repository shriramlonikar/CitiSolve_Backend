import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userImage: {
    data: Buffer,       // image uploaded by user
    contentType: String
  },
  adminImage: {
    data: Buffer,       // image uploaded by admin after fix
    contentType: String
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // assuming you have a User model
    required: true
  },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //     default: "Point"
  //   },
  //   coordinates: {
  //     type: [Number], // [longitude, latitude]
  //     required: true
  //   }
  // }
}, { timestamps: true });

// Geospatial index for location queries
// RequestSchema.index({ location: "2dsphere" });

const Request = mongoose.model("Request", RequestSchema);

export default Request;