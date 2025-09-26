import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
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
  role: { type: String, enum: ["user", "admin", "vendor"], default: "user" },
});

UserSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function () {
  return jwt.sign({ email: this.email, id: this._id }, "nnanna", {
    expiresIn: "24h",
  });
};

const User = mongoose.model("user", UserSchema);

export default User;