import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [50, "Email must not be longer than 50 characters"],
  },
  password: {
    type: String,
    select: false,
  },
  username: {
    type: String,
  },
  role: { type: String, enum: ["user", "admin"], default: "admin" },
});

AdminSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

AdminSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email, id: this._id }, "nnanna", {
    expiresIn: "24h",
  });
};

const Admin = mongoose.model("admin", AdminSchema);

export default Admin;